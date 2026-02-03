import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
});

export type CreateGenerationRequest = {
  productKitId: string;
  templateId: string;
  mode: "standard" | "pro";
};

export type CreateGenerationResponse = {
  generationId?: string;
  status?:
    | "queued"
    | "generating_shots"
    | "assembling"
    | "adding_overlays"
    | "completed"
    | "failed";
  outputVideoUrl?: string;
};

export type GetGenerationResponse = {
  generationId: string;
  status:
    | "queued"
    | "generating_shots"
    | "assembling"
    | "adding_overlays"
    | "completed"
    | "failed";
  outputVideoUrl?: string;
  errorMessage?: string;
};

export async function createGeneration(data: {
  token: string;
  dto: CreateGenerationRequest;
}) {
  const response = await instance.post<CreateGenerationResponse>(
    "/generations",
    data.dto,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    },
  );

  return response.data;
}

export async function getGeneration(data: { token: string; generationId: string }) {
  const response = await instance.get<GetGenerationResponse>(
    `/generations/${data.generationId}`,
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    },
  );

  return response.data;
}
