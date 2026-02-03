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
