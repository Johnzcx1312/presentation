export function collectTextsFromHistory(history: unknown): string[] {
  const out: string[] = [];
  walk(history, out);
  return out;
}

function walk(node: unknown, out: string[]) {
  if (!node) return;
  if (Array.isArray(node)) {
    node.forEach((n) => walk(n, out));
    return;
  }
  if (typeof node !== 'object') return;
  const obj = node as Record<string, unknown>;
  if (typeof obj.text === 'string') out.push(obj.text);

  if (typeof obj.msg === 'string') {
    try {
      const parsed = JSON.parse(obj.msg);
      walk(parsed, out);
    } catch {
      // ignore malformed msg
    }
  }
  for (const value of Object.values(obj)) walk(value, out);
}
