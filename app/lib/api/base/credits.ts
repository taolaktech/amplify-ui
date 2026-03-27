import axiosInstance from "./axios";

export async function getSubscriptionUsageSummary(params: {
  token: string;
  signal?: AbortSignal;
}): Promise<{ creditsRemaining?: number; creditsLimit?: number } | null> {
  try {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST;
    if (!apiHost) return null;

    const res = await axiosInstance.get("/credit-ledger/subscription-usage", {
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
      signal: params.signal,
    });

    const json = res.data;

    const creditsRemaining = Number(json?.data?.totalTokenBalance);
    const creditsLimit = Number(json?.data?.totalSubscriptionTokens);

    return {
      creditsRemaining: Number.isFinite(creditsRemaining)
        ? creditsRemaining
        : undefined,
      creditsLimit: Number.isFinite(creditsLimit) ? creditsLimit : undefined,
    };
  } catch (e) {
    return null;
  }
}
