export type UsageLimits = {
  creditsLimit: number;
  creativesLimit: number;
  campaignsLimit: number;
  storageLimitGb: number;
};

export function getUsageLimits(planName?: string | null): UsageLimits {
  const p = (planName || "STARTER").toUpperCase();

  if (p.includes("GROW")) {
    return {
      creditsLimit: 1500,
      creativesLimit: 200,
      campaignsLimit: 10,
      storageLimitGb: 10,
    };
  }

  if (p.includes("STARTER")) {
    return {
      creditsLimit: 800,
      creativesLimit: 100,
      campaignsLimit: 5,
      storageLimitGb: 5,
    };
  }

  if (p.includes("SCALE")) {
    return {
      creditsLimit: 5000,
      creativesLimit: 1000,
      campaignsLimit: 50,
      storageLimitGb: 50,
    };
  }

  return {
    creditsLimit: 800,
    creativesLimit: 100,
    campaignsLimit: 5,
    storageLimitGb: 5,
  };
}
