import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

export type VideoTemplate = {
  _id: string;
  templateId?: string;
  type: "video";
  sourceS3Url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  metadata?: Record<string, any>;
};

export type ListTemplatesResponse = {
  templates: VideoTemplate[];
  total: number;
  pages: number;
};

export async function listVideoTemplates(data: {
  token: string;
  page?: number;
  limit?: number;
}) {
  const response = await instance.get<ListTemplatesResponse>("/templates", {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
    params: {
      type: "video",
      page: data.page || 1,
      limit: data.limit || 20,
    },
  });

  return response.data;
}
