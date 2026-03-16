import { ResumeSearchAdapter, WorkflowInput, WorkflowOutput } from '../adapters/types';
import { runSearchLoop } from '../orchestration/search_loop';

export async function resumeSearchWorkflow(input: WorkflowInput, adapter: ResumeSearchAdapter): Promise<WorkflowOutput> {
  return runSearchLoop(input, adapter);
}
