import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
          '',
        ),
      },
    });
    this.bucketName = this.configService.get<string>(
      'AWS_S3_BUCKET_NAME',
      'amplify-templates',
    );
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string,
    folder = 'templates',
  ): Promise<{ key: string; url: string }> {
    const key = `${folder}/${uuidv4()}-${fileName}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file,
          ContentType: contentType,
        }),
      );

      const url = `https://${this.bucketName}.s3.amazonaws.com/${key}`;
      this.logger.info('File uploaded to S3', { key, url });

      return { key, url };
    } catch (error) {
      this.logger.error('Failed to upload file to S3', { error, fileName });
      throw error;
    }
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      this.logger.error('Failed to generate signed URL', { error, key });
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
      this.logger.info('File deleted from S3', { key });
    } catch (error) {
      this.logger.error('Failed to delete file from S3', { error, key });
      throw error;
    }
  }

  async listFiles(prefix: string): Promise<string[]> {
    try {
      const response = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: prefix,
        }),
      );

      return response.Contents?.map((item) => item.Key || '') || [];
    } catch (error) {
      this.logger.error('Failed to list files from S3', { error, prefix });
      throw error;
    }
  }
}
