import { CURRENCY_SYMBOL } from "@/constants/config";

export function formatCurrency(amount: number | string) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return `${CURRENCY_SYMBOL}${value.toFixed(2)}`;
}
