import { ResultEvaluation, SearchPlan } from '../adapters/types';

export function rewritePlan(plan: SearchPlan, evaluation: ResultEvaluation): SearchPlan {
  const next: SearchPlan = JSON.parse(JSON.stringify(plan));
  const action = evaluation.rewrite_action;

  for (const term of action.remove_terms) {
    for (const k of Object.keys(next.keyword_plan)) {
      next.keyword_plan[k] = next.keyword_plan[k].filter((x) => !x.includes(term));
    }
  }
  for (const term of action.add_terms) {
    if (!next.keyword_plan['技能']) next.keyword_plan['技能'] = [];
    next.keyword_plan['技能'].push(term);
  }
  for (const [from, to] of Object.entries(action.replace_map)) {
    for (const k of Object.keys(next.keyword_plan)) {
      next.keyword_plan[k] = next.keyword_plan[k].map((x) => (x === from ? to : x));
    }
  }
  Object.assign(next.fixed_filters, action.adjust_filters);
  for (const k of Object.keys(next.keyword_plan)) {
    next.keyword_plan[k] = Array.from(new Set(next.keyword_plan[k]));
  }
  return next;
}
