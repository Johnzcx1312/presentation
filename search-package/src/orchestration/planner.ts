import { SearchPlan } from '../adapters/types';
import { extractFixedFilters } from './fixed_filter_extractor';
import { decomposeKeywords } from './keyword_decomposer';

export function buildSearchPlan(history: unknown, userCommand: string): SearchPlan {
  return {
    fixed_filters: extractFixedFilters(history, userCommand),
    keyword_plan: decomposeKeywords(userCommand)
  };
}
