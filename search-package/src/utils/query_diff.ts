import { SearchPlan } from '../adapters/types';

export function planSignature(plan: SearchPlan): string {
  return JSON.stringify(plan);
}

export function diffPlan(prev: SearchPlan, next: SearchPlan): string {
  const p = JSON.stringify(prev);
  const n = JSON.stringify(next);
  if (p === n) return 'no_change';
  return `changed:${Math.abs(n.length - p.length)}`;
}
