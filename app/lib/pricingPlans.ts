const pricingPlans = [
  {
    name: "Free Plan",
    price: 0,
    features: [
      "Shopify Integration",
      "Up to $100 in ad credit for every 5 referrals",
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
      "Pay <b> 0% commission for the first 3 months,</b> then only <b>2.5% on ad spend.</b>",
    ],
  },
  {
    name: "Grow",
    price: parseInt(process.env.NEXT_PUBLIC_GROW_PLAN_PRICE || "99"),
    features: [
      "Everything in Starter plan plus",
      "Launch up to 30 AI-Powered Ad Product Campaigns across multiple ad platforms",
      "Generate Up to 450 AI-Generated Product Ad Creatives & Copy",
      "Pay <b> 0% commission for the first 3 months,</b> then only <b>1.5% on ad spend.</b>",
    ],
  },
  {
    name: "Scale",
    price: parseInt(process.env.NEXT_PUBLIC_SCALE_PLAN_PRICE || "199"),
    features: [
      "Everything in Grow plan plus",
      "Launch up to 150 AI-Powered Ad Product Campaigns across multiple ad platforms",
      "Generate Up to 4500 AI-Generated Product Ad Creatives & Copy",
      "Pay <b> 0% commission for the first 3 months,</b> then only <b>1% on ad spend.</b>",
    ],
  },
];

export default pricingPlans;
