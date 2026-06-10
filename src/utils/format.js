export function formatNumber(value) {
  if (typeof value === 'number') return String(Math.round(value));
  return value;
}

export function percent(value) {
  return `${formatNumber(value)}%`;
}
