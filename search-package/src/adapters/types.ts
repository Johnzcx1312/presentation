export type Strictness = 'strict' | 'balanced' | 'loose';

export interface FixedFilters {
  current_city: string[];
  expected_city: string[];
  experience_min: number | null;
  experience_max: number | null;
  education: string[];
  full_time_enroll: null | '统招本科' | '统招硕士' | '统招博士' | '统招大专';
  school_tier: string[];
  age_min: number | null;
  age_max: number | null;
  gender: '不限' | '男' | '女';
  languages: string;
}

export interface KeywordPlan {
  职位: string[];
  公司: string[];
  [key: string]: string[];
}

export interface SearchPlan {
  fixed_filters: FixedFilters;
  keyword_plan: KeywordPlan;
}

export interface ResumeRecord {
  id: string;
  title: string;
  company?: string;
  city?: string;
  years?: number;
  skills?: string[];
  summary?: string;
}

export interface ResumeSearchRequest {
  plan: SearchPlan;
  top_k: number;
}

export interface ResumeSearchResponse {
  total: number;
  results: ResumeRecord[];
}

export interface ResumeSearchAdapter {
  search(request: ResumeSearchRequest): Promise<ResumeSearchResponse>;
}

export interface RewriteAction {
  mode: 'tighten' | 'broaden' | 'replace_ambiguous_terms' | 'rebalance';
  add_terms: string[];
  remove_terms: string[];
  replace_map: Record<string, string>;
  adjust_filters: Partial<FixedFilters>;
}

export interface ResultEvaluation {
  quality: 'good' | 'medium' | 'bad';
  problems: Array<'too_many' | 'too_few' | 'title_drift' | 'skill_mismatch' | 'seniority_mismatch' | 'location_mismatch'>;
  reason: string;
  should_retry: boolean;
  rewrite_action: RewriteAction;
}

export interface WorkflowInput {
  user_command: string;
  history_context: unknown;
  options?: {
    max_iterations?: number;
    top_k_eval?: number;
    strictness?: Strictness;
  };
}

export interface RoundDiagnostic {
  round: number;
  query_summary: string;
  result_count: number;
  quality: 'good' | 'medium' | 'bad';
  problems: string[];
  reason: string;
  rewrite_action: RewriteAction;
  query_diff: string;
}

export interface WorkflowOutput {
  status: 'success' | 'partial' | 'failed';
  iterations_used: number;
  final_query_plan: SearchPlan;
  fixed_filters: FixedFilters;
  keyword_plan: KeywordPlan;
  diagnostics: RoundDiagnostic[];
  results: ResumeRecord[];
  user_facing_summary: string;
}
