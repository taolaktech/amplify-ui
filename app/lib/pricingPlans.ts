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
      "Pay 0% commission on Ad Spend",
    ],
  },
  {
    name: "Grow",
    price: parseInt(process.env.NEXT_PUBLIC_GROW_PLAN_PRICE || "99"),
    features: [
      "Everything in Starter plan plus",
      "Launch up to 30 AI-Powered Ad Product Campaigns across multiple ad platforms",
      "Generate Up to 450 AI-Generated Product Ad Creatives & Copy",
      "Pay 0% commission on Ad Spend",
    ],
  },
  // {
  //   name: "Scale",
  //   price: parseInt(process.env.NEXT_PUBLIC_SCALE_PLAN_PRICE || "199"),
  //   features: [
  //     "Everything in Grow plan plus",
  //     "Launch up to 150 AI-Powered Ad Product Campaigns across multiple ad platforms",
  //     "Generate Up to 4500 AI-Generated Product Ad Creatives & Copy",
  //     "Pay 0% commission on Ad Spend",
  //   ],
  // },
];

export default pricingPlans;

export const priceId = {
  FREE: {
    MONTHLY: "price_1RJOC84K0EUJXpsuHnFOBtZf",
    QUARTERLY: "price_1RJOC84K0EUJXpsuHnFOBtZf",
    YEARLY: "price_1RJOC84K0EUJXpsuHnFOBtZf",
  },
  STARTER: {
    MONTHLY: "price_1RJOIF4K0EUJXpsuXoWVsLvI",
    QUARTERLY: "price_1RJOsq4K0EUJXpsut6AGoSqQ",
    YEARLY: "price_1RJOvK4K0EUJXpsu9JjKZk5q",
  },
  GROW: {
    MONTHLY: "price_1RJORI4K0EUJXpsuA3Uc1yff",
    QUARTERLY: "price_1RJOzX4K0EUJXpsuhbvXdRFy",
    YEARLY: "price_1RJP0t4K0EUJXpsuGrlrCi0Z",
  },
  SCALE: {
    MONTHLY: "price_1RJOWj4K0EUJXpsuQ3rqPxEU",
    QUARTERLY: "price_1RJP4F4K0EUJXpsupXziADUr",
    YEARLY: "price_1RJP5L4K0EUJXpsuP0J14AlF",
  },
};

export const planIdToName = {
  price_1RJOIF4K0EUJXpsuXoWVsLvI: {
    name: "STARTER",
    cycle: "MONTHLY",
    price: 35,
  },
  price_1RJOsq4K0EUJXpsut6AGoSqQ: {
    name: "STARTER",
    cycle: "QUARTERLY",
    price: 33,
  },
  price_1RJOvK4K0EUJXpsu9JjKZk5q: {
    name: "STARTER",
    cycle: "YEARLY",
    price: 30,
  },
  price_1RJORI4K0EUJXpsuA3Uc1yff: {
    name: "GROW",
    cycle: "MONTHLY",
    price: 99,
  },
  price_1RJOzX4K0EUJXpsuhbvXdRFy: {
    name: "GROW",
    cycle: "QUARTERLY",
    price: 94,
  },
  price_1RJP0t4K0EUJXpsuGrlrCi0Z: {
    name: "GROW",
    cycle: "YEARLY",
    price: 84,
  },

  price_1RJOWj4K0EUJXpsuQ3rqPxEU: {
    name: "SCALE",
    cycle: "MONTHLY",
    price: 199,
  },
  price_1RJP4F4K0EUJXpsupXziADUr: {
    name: "SCALE",
    cycle: "QUARTERLY",
    price: 189,
  },
  price_1RJP5L4K0EUJXpsuP0J14AlF: {
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
      process.env.NEXT_PUBLIC_BILLING_CYCLE_QUARTERLY_DISCOUNT
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
      process.env.NEXT_PUBLIC_BILLING_CYCLE_YEARLY_DISCOUNT
    )}%</span> Off</span>`,
    discount: Number(process.env.NEXT_PUBLIC_BILLING_CYCLE_YEARLY_DISCOUNT),
  },
};
