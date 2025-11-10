import Holidays from "date-holidays";

const baseCampaigns = [
  { label: "Product Launch", recommended: false },
  { label: "Flash Sale / Limited Time", recommended: false },
  { label: "Abandoned Cart Recovery", recommended: false },
  { label: "Upsell / Cross-sell", recommended: false },
  { label: "Seasonal Campaigns", recommended: false },
  { label: "Free Shipping Promo", recommended: false },
  { label: "Customer Reactivation", recommended: false },
  { label: "Bestseller Boost", recommended: false },
  { label: "High ROAS Booster", recommended: false },
  { label: "Slow-Mover Inventory Push", recommended: false },
];

// Utility function to get Easter Sunday for a given year
function getEasterDate(year: number): Date {
  const f = Math.floor;
  const a = year % 19;
  const b = f(year / 100);
  const c = year % 100;
  const d = f(b / 4);
  const e = b % 4;
  const g = f((8 * b + 13) / 25);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = f(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = f((a + 11 * h + 22 * l) / 451);
  const month = f((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

export const getCampaignTypes = () => {
  new Holidays("NG"); // Set your country (e.g., NG = Nigeria)
  const today = new Date();
  const campaigns = [...baseCampaigns];
  const year = today.getFullYear();

  // Easter season (5 days before)
  const easter = getEasterDate(year);
  const easterStart = new Date(easter);
  easterStart.setDate(easter.getDate() - 5);

  const add = (label: string) =>
    campaigns.push({
      label,
      recommended: false,
    });

  // === Valentine’s (Feb 9–14)
  if (today.getMonth() === 1 && today.getDate() >= 9 && today.getDate() <= 14)
    add("Valentine’s Day");

  // === Easter (5 days before up to Easter Sunday)
  if (today >= easterStart && today <= easter) add("Easter Campaign 🕊️");

  // === Back-to-School (Aug 20–Sept 10)
  if (
    (today.getMonth() === 7 && today.getDate() >= 20) ||
    (today.getMonth() === 8 && today.getDate() <= 10)
  )
    add("Back-to-School");

  // === Black Friday / Cyber Monday (last Fri–Mon of November)
  const bf = new Date(year, 10, 1);
  while (bf.getDay() !== 5) bf.setDate(bf.getDate() + 1); // first Friday
  const bfDate = bf.getDate() + 21; // last Friday = 4th Friday
  const bfStart = new Date(year, 10, bfDate);
  const bfEnd = new Date(year, 10, bfDate + 3);
  if (today >= bfStart && today <= bfEnd) add("Black Friday / Cyber Monday 🛍️");

  // === Christmas / Holiday Season (Dec 20–31)
  if (today.getMonth() === 11 && today.getDate() >= 20)
    add("Christmas / Holiday Campaign");

  // === New Year / Fitness Resets (Jan 1–15)
  if (today.getMonth() === 0 && today.getDate() <= 15)
    add("New Year / Fitness Resets");

  // === Mother’s Day (2nd Sunday in May)

  let motherDayCount = 0;
  for (let i = 1; i <= 31; i++) {
    const d = new Date(year, 4, i);
    if (d.getDay() === 0) motherDayCount++;
    if (motherDayCount === 2) {
      if (
        today.toDateString() === d.toDateString() ||
        today.getTime() - d.getTime() <= 3 * 24 * 60 * 60 * 1000
      )
        add("Mother’s Day");
      break;
    }
  }

  // === Father’s Day (3rd Sunday in June)

  let fatherDayCount = 0;
  for (let i = 1; i <= 30; i++) {
    const d = new Date(year, 5, i);
    if (d.getDay() === 0) fatherDayCount++;
    if (fatherDayCount === 3) {
      if (
        today.toDateString() === d.toDateString() ||
        today.getTime() - d.getTime() <= 3 * 24 * 60 * 60 * 1000
      )
        add("Father’s Day");
      break;
    }
  }

  return campaigns;
};
