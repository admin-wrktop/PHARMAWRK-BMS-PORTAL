/**
 * Day boundaries in the user's local time for "YYYY-MM-DD" strings.
 * new Date("YYYY-MM-DD") is midnight UTC (05:30 in India), which drops most
 * of the last day of a range; these use local midnight / end of day.
 */
function parts(ymd) {
  const [y, m, d] = String(ymd || "").split("-").map(Number);
  return [y, (m || 1) - 1, d || 1];
}
export function dayStartMs(ymd) {
  const [y, m, d] = parts(ymd);
  return new Date(y, m, d, 0, 0, 0, 0).getTime();
}
export function dayEndMs(ymd) {
  const [y, m, d] = parts(ymd);
  return new Date(y, m, d, 23, 59, 59, 999).getTime();
}
