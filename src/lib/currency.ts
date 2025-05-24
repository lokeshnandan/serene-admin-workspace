
/**
 * Formats a number as Indian Rupee currency
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Simple rupee symbol formatter
 * @param amount - The amount to format
 * @returns Simple formatted string with rupee symbol
 */
export const formatSimpleCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};
