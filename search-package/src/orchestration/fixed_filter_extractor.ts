import { FixedFilters } from '../adapters/types';
import { collectTextsFromHistory } from '../utils/history_parser';
import { defaultFixedFilters, normalizeFixedFilters } from '../utils/normalization';

function parseExperience(text: string): number | null {
  const m = text.match(/(\d+)年/);
  return m ? Number(m[1]) : null;
}

export function extractFixedFilters(history: unknown, userCommand: string): FixedFilters {
  const baseline = defaultFixedFilters();
  if (history && typeof history === 'object' && !Array.isArray(history)) {
    const h = history as Record<string, unknown>;
    if (Array.isArray(h.education)) baseline.education = h.education as string[];
    if (typeof h.age_max === 'number') baseline.age_max = h.age_max;
  }

  for (const t of collectTextsFromHistory(history)) {
    if (t.includes('期望城市:')) baseline.expected_city.push(t.split(':')[1]);
    if (t.includes('统招要求:')) baseline.full_time_enroll = t.split(':')[1] as FixedFilters['full_time_enroll'];
    if (t.includes('学历:')) {
      const value = t.split(':')[1];
      if (value === '硕士') baseline.education = ['硕士', '博士/博士后'];
    }
    if (t.includes('经验:')) baseline.experience_min = parseExperience(t);
  }

  if (/再加个?北京/.test(userCommand)) baseline.expected_city.push('北京');
  if (/学历放宽/.test(userCommand)) baseline.education = ['大专', '本科', '硕士', '博士/博士后'];
  if (/年龄不要限制|年龄不限/.test(userCommand)) {
    baseline.age_min = null;
    baseline.age_max = null;
  }
  return normalizeFixedFilters(baseline);
}
