import { FixedFilters } from '../adapters/types';

const EDUCATION_ORDER = ['中专/中技', '高中及以下', '大专', '本科', '硕士', '博士/博士后'];

export const defaultFixedFilters = (): FixedFilters => ({
  current_city: [],
  expected_city: [],
  experience_min: null,
  experience_max: null,
  education: ['不限'],
  full_time_enroll: null,
  school_tier: ['不限'],
  age_min: null,
  age_max: null,
  gender: '不限',
  languages: ''
});

export function normalizeFixedFilters(input: FixedFilters): FixedFilters {
  const f = { ...input };
  f.current_city = Array.from(new Set(f.current_city)).slice(0, 5);
  f.expected_city = Array.from(new Set(f.expected_city)).slice(0, 5);
  if (f.experience_min !== null && f.experience_max !== null && f.experience_min > f.experience_max) {
    [f.experience_min, f.experience_max] = [f.experience_max, f.experience_min];
  }
  if (f.age_min !== null && f.age_min < 18) f.age_min = 18;
  if (f.age_max !== null && f.age_max < 18) f.age_max = 18;
  if (f.age_min !== null && f.age_max !== null && f.age_min > f.age_max) {
    [f.age_min, f.age_max] = [f.age_max, f.age_min];
  }

  if (f.full_time_enroll === '统招本科') {
    f.education = mergeEducation(f.education, ['本科', '硕士', '博士/博士后']);
  }
  if (f.full_time_enroll === '统招硕士') {
    f.education = mergeEducation(f.education, ['硕士', '博士/博士后']);
  }
  if (f.school_tier.some((s) => ['985', '211', '双一流'].includes(s))) {
    f.education = mergeEducation(f.education, ['本科', '硕士', '博士/博士后']);
  }
  return f;
}

function mergeEducation(base: string[], add: string[]): string[] {
  const set = new Set(base.includes('不限') ? [] : base);
  for (const item of add) set.add(item);
  return Array.from(set).sort((a, b) => EDUCATION_ORDER.indexOf(a) - EDUCATION_ORDER.indexOf(b));
}
