import {
  ResumeSearchAdapter,
  WorkflowInput,
  WorkflowOutput,
  SearchPlan,
  RoundDiagnostic
} from '../adapters/types';
import { DEFAULT_MAX_ITERATIONS, DEFAULT_TOP_K_EVAL } from '../config';
import { diffPlan, planSignature } from '../utils/query_diff';
import { buildSearchPlan } from './planner';
import { evaluateResults } from './evaluator';
import { rewritePlan } from './rewriter';

export async function runSearchLoop(input: WorkflowInput, adapter: ResumeSearchAdapter): Promise<WorkflowOutput> {
  const maxIterations = Math.min(input.options?.max_iterations ?? DEFAULT_MAX_ITERATIONS, 3);
  const topK = input.options?.top_k_eval ?? DEFAULT_TOP_K_EVAL;
  let plan: SearchPlan = buildSearchPlan(input.history_context, input.user_command);
  let prevPlan: SearchPlan | null = null;
  const diagnostics: RoundDiagnostic[] = [];
  const seen = new Set<string>();
  let bestResults: Awaited<ReturnType<ResumeSearchAdapter['search']>> = { total: 0, results: [] };

  for (let round = 1; round <= maxIterations; round += 1) {
    const sig = planSignature(plan);
    if (seen.has(sig)) break;
    seen.add(sig);

    const response = await adapter.search({ plan, top_k: topK });
    if (response.total > bestResults.total) bestResults = response;
    const evaluation = evaluateResults(plan, response.results, response.total);

    diagnostics.push({
      round,
      query_summary: JSON.stringify(plan.keyword_plan),
      result_count: response.total,
      quality: evaluation.quality,
      problems: evaluation.problems,
      reason: evaluation.reason,
      rewrite_action: evaluation.rewrite_action,
      query_diff: prevPlan ? diffPlan(prevPlan, plan) : 'initial'
    });

    if (!evaluation.should_retry || evaluation.quality === 'good') {
      return {
        status: 'success',
        iterations_used: round,
        final_query_plan: plan,
        fixed_filters: plan.fixed_filters,
        keyword_plan: plan.keyword_plan,
        diagnostics,
        results: response.results,
        user_facing_summary: '已找到可用候选人结果，匹配度整体可接受。'
      };
    }
    prevPlan = JSON.parse(JSON.stringify(plan));
    plan = rewritePlan(plan, evaluation);
  }

  return {
    status: bestResults.results.length ? 'partial' : 'failed',
    iterations_used: diagnostics.length,
    final_query_plan: plan,
    fixed_filters: plan.fixed_filters,
    keyword_plan: plan.keyword_plan,
    diagnostics,
    results: bestResults.results,
    user_facing_summary: '已返回当前最优结果，但建议补充目标公司/关键技能/职级范围以提升精准度。'
  };
}
