import { countries } from "countries-list";

export type AllowedCountry = {
  countryCode: string;
  countryName: string;
};

const BLOCKED_COUNTRY_CODES = new Set(["IR", "AF", "RU", "KP", "CU"]);
const BLOCKED_COUNTRY_NAMES = new Set([
  "iran",
  "iran, islamic republic of",
  "afghanistan",
  "russia",
  "russian federation",
  "north korea",
  "korea, democratic people's republic of",
  "cuba",
  "crimea",
]);

export const allowedCountries: AllowedCountry[] = Object.entries(countries)
  .filter(([code, country]) => {
    if (BLOCKED_COUNTRY_CODES.has(code)) return false;
    const name = (country.name || "").trim();
    if (!name) return false;
    return !BLOCKED_COUNTRY_NAMES.has(name.toLowerCase());
  })
  .map(([code, country]) => ({
    countryCode: code,
    countryName: country.name,
  }))
  .sort((a, b) => a.countryName.localeCompare(b.countryName));

const allowedCountriesByCode = new Map(
  allowedCountries.map((c) => [c.countryCode, c])
);

const allowedCountriesByName = new Map(
  allowedCountries.map((c) => [c.countryName.toLowerCase(), c])
);

export const getAllowedCountryName = (countryCode: string) =>
  allowedCountriesByCode.get(countryCode)?.countryName || countryCode;

export const getAllowedCountryCode = (countryName: string) =>
  allowedCountriesByName.get((countryName || "").trim().toLowerCase())
    ?.countryCode || countryName;
