import { ResumeSearchAdapter } from './types';

export interface ResumeSearchToolClient {
  runSearch(payload: unknown): Promise<unknown>;
}

export function createExternalResumeSearchAdapter(_client: ResumeSearchToolClient): ResumeSearchAdapter {
  return {
    async search() {
      throw new Error('External resume search tool is not wired yet. Please follow README adapter integration section.');
    }
  };
}
