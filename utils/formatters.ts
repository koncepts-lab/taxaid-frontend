/**
 * Internal helper to safely convert value to a number.
 * Handles strings with commas (e.g., "1,417,145" -> 1417145)
 */
const cleanNumber = (value: number | string | null | undefined): number => {
  if (value == null || value === "") return NaN;

  const clean = typeof value === "string" ? value.replace(/,/g, "") : value;
  return Number(clean);
};

/**
 * Formats a given number by converting it to millions.
 * Example: "1,417,145" -> "1.42"
 */
export const formatToMillions = (value: number | string | null | undefined, decimals: number = 2): string => {
  const num = cleanNumber(value);

  if (isNaN(num)) {
    return (0).toFixed(decimals);
  }

  const inMillions = num / 1_000_000;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(inMillions);
};

/**
 * Formats a number into millions with an optional suffix.
 * Example: 1500000 -> "1.50 M"
 */
export const formatInMillions = (
  value: number | string | null | undefined,
  options: { decimals?: number; suffix?: string; showCurrency?: boolean } = {},
): string => {
  const { decimals = 2, suffix = " M", showCurrency = false } = options;
  const num = cleanNumber(value);

  if (isNaN(num)) {
    return showCurrency ? `$0.00${suffix}` : `0.00${suffix}`;
  }

  const inMillions = num / 1_000_000;

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    style: showCurrency ? "currency" : "decimal",
    currency: "USD",
  }).format(inMillions);

  return `${formatted}${suffix}`;
};

/**
 * Formats a number using compact notation.
 * Example: "1,417,145" -> 1.42M
 */
export const formatCompactNumber = (value: number | string | null | undefined): string => {
  const num = cleanNumber(value);

  if (isNaN(num)) {
    return "0";
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Formats a number with commas and specified decimal places.
 * Example: 2761745 -> 2,761,745.00
 */
export const formatStandardNumber = (value: number | string | null | undefined, decimals: number = 2): string => {
  const num = cleanNumber(value);

  if (isNaN(num)) {
    return "0.00";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Formats a currency/number with thousands comma separators.
 * Example: 1417145 -> "1,417,145"
 */
export const formatCurrency = (
  value: number | string | null | undefined,
  decimals: number = 2,
  fallback: string = "-"
): string => {
  if (value === null || value === undefined || value === "") return fallback;
  const num = cleanNumber(value);

  if (isNaN(num)) {
    return String(value);
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Formats a money value with no decimals: full thousands-separated number
 * below 1M (e.g. 60475 -> "60,475"), compact "M" suffix at/above 1M
 * (e.g. 1500000 -> "2M").
 */
export const formatSmartCurrency = (value: number | string | null | undefined): string => {
  const num = cleanNumber(value);
  if (isNaN(num)) return "0";

  if (Math.abs(num) >= 1_000_000) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 0,
    }).format(num);
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Inserts thousands separators into every number inside a free-text string.
 * Example: "AR Report: 321000, Difference: 421580.75" -> "AR Report: 321,000, Difference: 421,580.75"
 */
export const formatEmbeddedNumbers = (text: string | null | undefined): string => {
  if (!text) return "";

  return String(text).replace(/-?\d+(\.\d+)?/g, (match) => {
    const [intPart, decPart] = match.split(".");
    const sign = intPart.startsWith("-") ? "-" : "";
    const digits = sign ? intPart.slice(1) : intPart;

    if (!decPart && digits.length === 4) {
      const n = Number(digits);
      if (n >= 1900 && n <= 2099) return match;
    }

    const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return sign + grouped + (decPart ? "." + decPart : "");
  });
};
