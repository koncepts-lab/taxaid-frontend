/**
 * Formats a given number by converting it to millions.
 * Useful for displaying large numbers in a more readable format.
 * Example: 201000 -> 0.20 (or whatever decimal you prefer)
 * 
 * @param value The raw number (e.g., 201000)
 * @param decimals Number of decimal places to include (default: 2)
 * @returns The formatted string representing millions
 */
export const formatToMillions = (value: number | string | null | undefined, decimals: number = 2): string => {
  if (value == null || isNaN(Number(value))) {
    return (0).toFixed(decimals);
  }

  const num = Number(value);
  const inMillions = num / 1_000_000;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(inMillions);
};

/**
 * Formats a number into millions with an optional suffix.
 * Example: 1500000 -> "1.50 M" or "1.50 Million"
 * 
 * @param value The raw number
 * @param options Formatting options (decimals, suffix)
 * @returns Formatted string with suffix
 */
export const formatInMillions = (
  value: number | string | null | undefined,
  options: { decimals?: number, suffix?: string, showCurrency?: boolean } = {}
): string => {
  const { decimals = 2, suffix = ' M', showCurrency = false } = options;

  if (value == null || isNaN(Number(value))) {
    return showCurrency ? `$0.00${suffix}` : `0.00${suffix}`;
  }

  const num = Number(value);
  const inMillions = num / 1_000_000;

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    style: showCurrency ? 'currency' : 'decimal',
    currency: 'USD',
  }).format(inMillions);

  return `${formatted}${suffix}`;
};

/**
 * Formats a number using compact notation.
 * Example: 201000 -> 201K, 1500000 -> 1.5M
 * 
 * @param value The raw number
 * @returns The compact formatted string
 */
export const formatCompactNumber = (value: number | string | null | undefined): string => {
  if (value == null || isNaN(Number(value))) {
    return '0';
  }

  const num = Number(value);

  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Formats a number with commas and specified decimal places.
 * Example: 2761745 -> 2,761,745.00
 * 
 * @param value The raw number
 * @param decimals Number of decimal places (default: 2)
 * @returns The formatted string
 */
export const formatStandardNumber = (value: number | string | null | undefined, decimals: number = 2): string => {
  if (value == null || isNaN(Number(value))) {
    return '0.00';
  }

  const num = Number(value);

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};
