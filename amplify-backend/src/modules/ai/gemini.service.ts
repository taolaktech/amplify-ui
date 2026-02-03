import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  GoogleGenerativeAI,
  GenerativeModel,
  Part,
} from '@google/generative-ai';

export interface TemplateLayer {
  id: string;
  type: 'image' | 'text' | 'shape' | 'video';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content?: string;
  isReplaceable: boolean;
  replaceableField?: 'productImage' | 'productName' | 'description' | 'price' | 'cta';
  style?: Record<string, any>;
}

export interface ParsedTemplateJson {
  templateId: string;
  mediaType: 'image' | 'video';
  dimensions: { width: number; height: number };
  layers: TemplateLayer[];
  staticCopy: string[];
  replaceableFields: {
    productImage: boolean;
    productName: boolean;
    description: boolean;
    price: boolean;
    cta: boolean;
  };
  metadata: Record<string, any>;
}

export interface ProductData {
  productImage: string;
  productName: string;
  description?: string;
  price?: string;
  cta?: string;
}

export interface GeneratedCreative {
  base64Data: string;
  mimeType: string;
  metadata: Record<string, any>;
}

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private visionModel: GenerativeModel;

  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY not configured');
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: this.configService.get<string>('GEMINI_MODEL', 'gemini-1.5-pro'),
      });
      this.visionModel = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-pro-vision',
      });
    }
  }

  async parseTemplateToJson(
    templateUrl: string,
    mediaType: 'image' | 'video',
  ): Promise<ParsedTemplateJson> {
    this.logger.info('Parsing template to JSON', { templateUrl, mediaType });

    try {
      const prompt = `Analyze this ${mediaType} advertisement template and extract its structure into a JSON format.

Identify:
1. The overall dimensions and layout
2. Each visual layer (images, text, shapes)
3. Which elements are static vs replaceable
4. Replaceable fields should be categorized as: productImage, productName, description, price, or cta
5. Any static copy/text that should remain unchanged
6. Position and size of each element

Return a JSON object with this exact structure:
{
  "mediaType": "${mediaType}",
  "dimensions": { "width": number, "height": number },
  "layers": [
    {
      "id": "unique_id",
      "type": "image|text|shape|video",
      "position": { "x": number, "y": number },
      "size": { "width": number, "height": number },
      "content": "text content if applicable",
      "isReplaceable": boolean,
      "replaceableField": "productImage|productName|description|price|cta or null",
      "style": { "fontSize": number, "fontFamily": string, "color": string, etc }
    }
  ],
  "staticCopy": ["array of static text elements"],
  "replaceableFields": {
    "productImage": boolean,
    "productName": boolean,
    "description": boolean,
    "price": boolean,
    "cta": boolean
  },
  "metadata": { "any additional metadata" }
}

Only return valid JSON, no markdown or explanation.`;

      const imagePart = await this.fetchImageAsPart(templateUrl);
      
      const result = await this.visionModel.generateContent([prompt, imagePart]);
      const response = result.response;
      const text = response.text();

      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new BadRequestException('Failed to parse template structure');
      }

      const parsed = JSON.parse(jsonMatch[0]) as Omit<ParsedTemplateJson, 'templateId'>;
      
      this.logger.info('Template parsed successfully', {
        layers: parsed.layers?.length,
        replaceableFields: parsed.replaceableFields,
      });

      return {
        templateId: '', // Will be set by caller
        ...parsed,
      };
    } catch (error: any) {
      this.logger.error('Failed to parse template', {
        error: error.message,
        templateUrl,
      });
      throw new BadRequestException(`Template parsing failed: ${error.message}`);
    }
  }

  async generateCreative(
    parsedTemplate: ParsedTemplateJson,
    productData: ProductData,
    originalTemplateUrl: string,
  ): Promise<GeneratedCreative> {
    this.logger.info('Generating creative from template', {
      templateId: parsedTemplate.templateId,
      productName: productData.productName,
    });

    try {
      const prompt = `You are an expert ad creative generator. Based on the original template image and the parsed template structure, generate a new advertisement image.

Original Template Structure:
${JSON.stringify(parsedTemplate, null, 2)}

Product Data to Insert:
- Product Name: ${productData.productName}
- Description: ${productData.description || 'N/A'}
- Price: ${productData.price || 'N/A'}
- CTA: ${productData.cta || 'Shop Now'}

Instructions:
1. Maintain the exact same layout, style, and visual hierarchy as the original template
2. Replace the replaceable fields with the provided product data
3. Keep all static elements unchanged
4. Ensure text is properly positioned and sized
5. The output should look professionally designed and match the original template's aesthetic

Generate a new advertisement image that follows these specifications exactly.`;

      const imagePart = await this.fetchImageAsPart(originalTemplateUrl);
      
      // For image generation, we'll use Gemini's capabilities
      // Note: Gemini 1.5 Pro doesn't directly generate images, 
      // so we return instructions for a downstream image generation service
      // or use Imagen API if available
      
      const result = await this.visionModel.generateContent([prompt, imagePart]);
      const response = result.response;
      
      // For now, return the generation instructions
      // In production, this would integrate with Imagen or similar
      return {
        base64Data: '', // Would contain actual generated image
        mimeType: parsedTemplate.mediaType === 'video' ? 'video/mp4' : 'image/png',
        metadata: {
          prompt: prompt,
          productData,
          templateId: parsedTemplate.templateId,
          generatedAt: new Date().toISOString(),
          geminiResponse: response.text(),
        },
      };
    } catch (error: any) {
      this.logger.error('Failed to generate creative', {
        error: error.message,
        templateId: parsedTemplate.templateId,
      });
      throw new BadRequestException(`Creative generation failed: ${error.message}`);
    }
  }

  async generateAdCopy(
    productData: ProductData,
    style: 'professional' | 'casual' | 'urgent' | 'luxury' = 'professional',
  ): Promise<{ headline: string; description: string; cta: string }> {
    const prompt = `Generate ad copy for the following product:

Product: ${productData.productName}
Description: ${productData.description || 'N/A'}
Price: ${productData.price || 'N/A'}
Style: ${style}

Return JSON with:
{
  "headline": "catchy headline under 10 words",
  "description": "compelling description under 30 words",
  "cta": "call to action under 5 words"
}

Only return valid JSON.`;

    const result = await this.model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        headline: productData.productName,
        description: productData.description || '',
        cta: 'Shop Now',
      };
    }

    return JSON.parse(jsonMatch[0]);
  }

  async analyzeTemplateQuality(templateUrl: string): Promise<{
    score: number;
    issues: string[];
    suggestions: string[];
  }> {
    const prompt = `Analyze this advertisement template for quality and effectiveness.

Rate it on a scale of 1-100 and provide:
1. Quality score
2. Any issues found (poor contrast, unclear CTA, etc.)
3. Suggestions for improvement

Return JSON:
{
  "score": number,
  "issues": ["array of issues"],
  "suggestions": ["array of suggestions"]
}

Only return valid JSON.`;

    const imagePart = await this.fetchImageAsPart(templateUrl);
    const result = await this.visionModel.generateContent([prompt, imagePart]);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { score: 70, issues: [], suggestions: [] };
    }

    return JSON.parse(jsonMatch[0]);
  }

  private async fetchImageAsPart(url: string): Promise<Part> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = response.headers.get('content-type') || 'image/jpeg';

    return {
      inlineData: {
        data: base64,
        mimeType,
      },
    };
  }
}
