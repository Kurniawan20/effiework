/**
 * Utility functions for formatting values in the application
 */

/**
 * Format a number to Indonesian Rupiah currency format
 * @param amount The amount to format
 * @param options Optional formatting options
 * @returns Formatted string in Rupiah format (e.g., "Rp 1.000.000")
 */
export const formatRupiah = (amount: number, options: { withSymbol?: boolean } = { withSymbol: true }): string => {
  // Format the number with Indonesian locale (id-ID) and currency style
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Format the amount
  const formatted = formatter.format(amount);

  // If withSymbol is false, remove the currency symbol
  if (options.withSymbol === false) {
    // Remove "Rp" and any non-breaking spaces
    return formatted.replace(/Rp\s*/, '');
  }

  return formatted;
};

/**
 * Format a number to Indonesian Rupiah currency format with decimal places
 * @param amount The amount to format
 * @param decimals Number of decimal places to show
 * @returns Formatted string in Rupiah format with decimals (e.g., "Rp 1.000.000,50")
 */
export const formatRupiahWithDecimals = (amount: number, decimals: number = 2): string => {
  // Format the number with Indonesian locale (id-ID) and currency style
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(amount);
};
