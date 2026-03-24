const pricingPlans = [
  {
    name: "Free",
    price: 0,
    features: [
      "Shopify Integration",
      "Launch 1 AI-Powered Ad Product campaign across multiple ad platforms",
      "AI-Powered marketing campaign setup, automation and optimization",
      "2 Set of AI-Generated Ad Creatives & Copy",
      "AI-Powered A/B Testing",
      "Unlimited Ad Spend",
      "15% commission on ad spend",
    ],
  },
  {
    name: "Starter",
    price: parseInt(process.env.NEXT_PUBLIC_STARTER_PLAN_PRICE || "49"),
    features: [
      "Everything in free plan plus",
      "Launch up to 15 AI-Powered Ad Product ad campaigns across multiple ad platforms",
      "Generate Up to 250 AI-Generated Product Ad Creatives & Copy",
      "Ready-to-Launch AI-Powered Product Campaigns designed to Boost Sales",
      "Unlimited Ad Spend",
      "Pay 0% commission on ad spend",
    ],
  },
  {
    name: "Grow",
    price: parseInt(process.env.NEXT_PUBLIC_GROW_PLAN_PRICE || "99"),
    features: [
      "Everything in Starter plan plus",
      "Launch up to 30 AI-Powered Ad Product Campaigns across multiple ad platforms",
      "Generate Up to 450 AI-Generated Product Ad Creatives & Copy",
      "Pay 0% commission on ad spend",
    ],
  },
  // {
  //   name: "Scale",
  //   price: parseInt(process.env.NEXT_PUBLIC_SCALE_PLAN_PRICE || "199"),
  //   features: [
  //     "Everything in Grow plan plus",
  //     "Launch up to 150 AI-Powered Ad Product Campaigns across multiple ad platforms",
  //     "Generate Up to 4500 AI-Generated Product Ad Creatives & Copy",
  //     "Pay <b> 0% commission for the first 3 months,</b> then only <b>1% on ad spend.</b>",
  //   ],
  // },
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
    price: 33,
  },
  [priceId.STARTER.YEARLY]: {
    name: "STARTER",
    cycle: "YEARLY",
    price: 30,
  },
  [priceId.GROW.MONTHLY]: {
    name: "GROW",
    cycle: "MONTHLY",
    price: 99,
  },
  [priceId.GROW.QUARTERLY]: {
    name: "GROW",
    cycle: "QUARTERLY",
    price: 94,
  },
  [priceId.GROW.YEARLY]: {
    name: "GROW",
    cycle: "YEARLY",
    price: 84,
  },

  [priceId.SCALE.MONTHLY]: {
    name: "SCALE",
    cycle: "MONTHLY",
    price: 199,
  },
  [priceId.SCALE.QUARTERLY]: {
    name: "SCALE",
    cycle: "QUARTERLY",
    price: 189,
  },
  [priceId.SCALE.YEARLY]: {
    name: "SCALE",
    cycle: "YEARLY",
    price: 169,
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
    discount: Number(process.env.NEXT_PUBLIC_BILLING_CYCLE_MONTHLY_DISCOUNT),
  },
  QUARTERLY: {
    title: "Quarterly",
    value: "quarter",
    statement: "Billed Every 3 Months",
    cycleDetails: "3 months",
    size: 3,
    billingDetails: `<span>Quarterly - <span class='num'>${Number(
      process.env.NEXT_PUBLIC_BILLING_CYCLE_QUARTERLY_DISCOUNT,
    )}%</span> Off</span>`,
    discount: Number(process.env.NEXT_PUBLIC_BILLING_CYCLE_QUARTERLY_DISCOUNT),
  },
  YEARLY: {
    title: "Yearly",
    value: "year",
    statement: "Billed Every Year",
    cycleDetails: "12 months",
    size: 12,
    billingDetails: `<span>Yearly - <span class='num'>${Number(
      process.env.NEXT_PUBLIC_BILLING_CYCLE_YEARLY_DISCOUNT,
    )}%</span> Off</span>`,
    discount: Number(process.env.NEXT_PUBLIC_BILLING_CYCLE_YEARLY_DISCOUNT),
  },
};
