const pricingPlans = [
  {
    name: "Starter",
    price: parseInt(process.env.NEXT_PUBLIC_STARTER_PLAN_PRICE || "35"),
    features: [
      "500 AI credits/month for ad generation",
      "Facebook & Instagram ads only",
      "Generate image ads, video ads, and ad copy",
      "Generate up to 50 AI ad creatives per month",
      "Unlimited ad spend",
      "0% commission on ad spend",
      "1GB asset storage",
      "Use your brand kit (fonts, colors, logo)",
    ],
  },
  {
    name: "Grow",
    price: parseInt(process.env.NEXT_PUBLIC_GROW_PLAN_PRICE || "99"),
    features: [
      "Everything in Starter",
      "1,500 AI credits/month",
      "Facebook, Instagram + Google Ads generation",
      "Generate image ads, video ads, ad copy and Google text ads",
      "Generate up to 200 AI ad creatives per month",
      "10GB asset storage",
    ],
  },
  {
    name: "Scale",
    price: parseInt(process.env.NEXT_PUBLIC_SCALE_PLAN_PRICE || "199"),
    features: [
      "Everything in Grow",
      "3,000 AI credits/month",
      "Facebook, Instagram + Google Ads generation",
      "Generate image ads, video ads, ad copy and Google text ads",
      "Generate up to 500 AI ad creatives per month",
      "Automated A/B testing for offers and creatives",
      "1TB asset storage",
    ],
  },
];

export default pricingPlans;

export const priceId = {
  STARTER: {
    MONTHLY:
      process.env.NEXT_PUBLIC_STARTER_PLAN_MONTHLY_PRICE_ID ||
      "price_1SaxZDKiCBcQA15ofiejlXmX",
    QUARTERLY:
      process.env.NEXT_PUBLIC_STARTER_PLAN_QUARTERLY_PRICE_ID ||
      "price_1SaxYaKiCBcQA15og6j7pZ5Q",
    YEARLY:
      process.env.NEXT_PUBLIC_STARTER_PLAN_YEARLY_PRICE_ID ||
      "price_1SaxXAKiCBcQA15oOLNyxmTQ",
  },
  GROW: {
    MONTHLY:
      process.env.NEXT_PUBLIC_GROW_PLAN_MONTHLY_PRICE_ID ||
      "price_1SaxkAKiCBcQA15onkgQcr7A",
    QUARTERLY:
      process.env.NEXT_PUBLIC_GROW_PLAN_QUARTERLY_PRICE_ID ||
      "price_1SaxkAKiCBcQA15oLtUhE9ji",
    YEARLY:
      process.env.NEXT_PUBLIC_GROW_PLAN_YEARLY_PRICE_ID ||
      "price_1SaxkAKiCBcQA15oL37PSgJo",
  },
  SCALE: {
    MONTHLY:
      process.env.NEXT_PUBLIC_SCALE_PLAN_MONTHLY_PRICE_ID ||
      "price_1SaxnmKiCBcQA15oqHan2RYe",
    QUARTERLY:
      process.env.NEXT_PUBLIC_SCALE_PLAN_QUARTERLY_PRICE_ID ||
      "price_1SaxnmKiCBcQA15obdHqhO8I",
    YEARLY:
      process.env.NEXT_PUBLIC_SCALE_PLAN_YEARLY_PRICE_ID ||
      "price_1SaxnmKiCBcQA15ofRN01ZjJ",
  },
};

export const planIdToName = {
  [priceId.STARTER.MONTHLY]: {
    name: "STARTER",
    cycle: "MONTHLY",
    price: 35,
  },
  [priceId.STARTER.QUARTERLY]: {
    name: "STARTER",
    cycle: "QUARTERLY",
    price: 96,
  },
  [priceId.STARTER.YEARLY]: {
    name: "STARTER",
    cycle: "YEARLY",
    price: 336,
  },
  [priceId.GROW.MONTHLY]: {
    name: "GROW",
    cycle: "MONTHLY",
    price: 99,
  },
  [priceId.GROW.QUARTERLY]: {
    name: "GROW",
    cycle: "QUARTERLY",
    price: 267,
  },
  [priceId.GROW.YEARLY]: {
    name: "GROW",
    cycle: "YEARLY",
    price: 948,
  },

  [priceId.SCALE.MONTHLY]: {
    name: "SCALE",
    cycle: "MONTHLY",
    price: 199,
  },
  [priceId.SCALE.QUARTERLY]: {
    name: "SCALE",
    cycle: "QUARTERLY",
    price: 537,
  },
  [priceId.SCALE.YEARLY]: {
    name: "SCALE",
    cycle: "YEARLY",
    price: 1908,
  },
};

export const billingCycles = {
  MONTHLY: {
    title: "Monthly",
    value: "month",
    statement: "Billed Every Month",
    cycleDetails: "1 month",
    size: 1,
    billingDetails: "Monthly",
    discount:
      Number(process.env.NEXT_PUBLIC_BILLING_CYCLE_MONTHLY_DISCOUNT) || 0,
  },
  QUARTERLY: {
    title: "Quarterly",
    value: "quarter",
    statement: "Billed Every 3 Months",
    cycleDetails: "3 months",
    size: 3,
    billingDetails: `<span>Quarterly - <span class='num'>${
      Number(process.env.NEXT_PUBLIC_BILLING_CYCLE_QUARTERLY_DISCOUNT) || 10
    }%</span> Off</span>`,
    discount:
      Number(process.env.NEXT_PUBLIC_BILLING_CYCLE_QUARTERLY_DISCOUNT) || 10,
  },
  YEARLY: {
    title: "Yearly",
    value: "year",
    statement: "Billed Every Year",
    cycleDetails: "12 months",
    size: 12,
    billingDetails: `<span>Yearly - <span class='num'>${
      Number(process.env.NEXT_PUBLIC_BILLING_CYCLE_YEARLY_DISCOUNT) || 20
    }%</span> Off</span>`,
    discount:
      Number(process.env.NEXT_PUBLIC_BILLING_CYCLE_YEARLY_DISCOUNT) || 20,
  },
};
