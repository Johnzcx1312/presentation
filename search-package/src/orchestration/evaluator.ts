import { ResultEvaluation, ResumeRecord, SearchPlan } from '../adapters/types';

export function evaluateResults(plan: SearchPlan, records: ResumeRecord[], total: number): ResultEvaluation {
  const problems: ResultEvaluation['problems'] = [];
  if (total > 200) problems.push('too_many');
  if (total < 5) problems.push('too_few');

  const top = records.slice(0, 10);
  const titleTerms = plan.keyword_plan.职位 ?? [];
  const skillTerms = plan.keyword_plan['技能'] ?? [];

  const titleHits = hitRate(top, (r) => titleTerms.some((t) => r.title.includes(t)));
  if (top.length > 0 && titleTerms.length > 0 && titleHits < 0.3) problems.push('title_drift');

  const skillHits = hitRate(top, (r) => skillTerms.length === 0 || skillTerms.some((s) => (r.skills ?? []).includes(s) || (r.summary ?? '').includes(s)));
  if (top.length > 0 && skillTerms.length > 0 && skillHits < 0.4) problems.push('skill_mismatch');

  const quality = problems.length === 0 ? 'good' : (problems.includes('too_many') || problems.includes('too_few') || problems.includes('title_drift') ? 'bad' : 'medium');
  const shouldRetry = quality !== 'good';
  const rewrite_action = chooseRewrite(problems);
  return {
    quality,
    problems,
    reason: problems.length ? `Detected ${problems.join(', ')}` : 'Result set looks usable',
    should_retry: shouldRetry,
    rewrite_action
  };
}

function hitRate(records: ResumeRecord[], fn: (r: ResumeRecord) => boolean): number {
  if (!records.length) return 0;
  return records.filter(fn).length / records.length;
}

function chooseRewrite(problems: ResultEvaluation['problems']): ResultEvaluation['rewrite_action'] {
  if (problems.includes('too_few')) {
    return { mode: 'broaden', add_terms: ['同义词'], remove_terms: ['次要限制'], replace_map: {}, adjust_filters: { experience_min: null } };
  }
  if (problems.includes('too_many')) {
    return { mode: 'tighten', add_terms: ['核心技能'], remove_terms: ['泛词'], replace_map: {}, adjust_filters: {} };
  }
  if (problems.includes('title_drift') || problems.includes('skill_mismatch')) {
    return { mode: 'replace_ambiguous_terms', add_terms: ['业务方向词'], remove_terms: ['歧义词'], replace_map: { 经理: '架构师' }, adjust_filters: {} };
  }
  return { mode: 'rebalance', add_terms: [], remove_terms: [], replace_map: {}, adjust_filters: {} };
}
