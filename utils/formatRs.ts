/** Nepali rupee display (Rs.) with thousands separators. */
export function formatRs(amount: number): string {
  const n = Number.isFinite(amount) ? amount : 0;
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
  return `Rs. ${formatted}`;
}
