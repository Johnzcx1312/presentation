import path from 'node:path';

export const DEFAULT_MAX_ITERATIONS = 3;
export const DEFAULT_TOP_K_EVAL = 10;

export const PROMPT_PATHS = {
  fixedFilter: path.join(__dirname, '..', 'skills', 'talent-search-strategy', 'prompts', 'fixed_filter_extraction.md'),
  keyword: path.join(__dirname, '..', 'skills', 'talent-search-strategy', 'prompts', 'keyword_decomposition.md'),
  evaluate: path.join(__dirname, '..', 'skills', 'talent-search-strategy', 'prompts', 'result_evaluation.md'),
  rewrite: path.join(__dirname, '..', 'skills', 'talent-search-strategy', 'prompts', 'query_rewrite.md')
};
