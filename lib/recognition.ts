/** Formats a "YYYY-MM" recognition date as "Jul 2026". */
export function formatRecognitionDate(value: string) {
  const [year, month] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1)).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}
