const STATE_PALETTE = [
  "#e85d9e",
  "#4ea5e0",
  "#57b881",
  "#e5a84b",
  "#9b7ede",
  "#e36a5c",
  "#36a7a0",
  "#c6ae38",
];

export function getStateColor(state: string, overrides: Record<string, string>): string {
  const override = overrides[state]?.trim();
  if (override) {
    return override;
  }

  let hash = 2166136261;
  for (const character of state) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return STATE_PALETTE[Math.abs(hash) % STATE_PALETTE.length] ?? STATE_PALETTE[0]!;
}
