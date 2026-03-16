import Ajv from 'ajv';
import fixedFiltersSchema from './fixed_filters.schema.json';
import keywordSchema from './keyword_plan.schema.json';
import workflowInputSchema from './workflow_input.schema.json';
import workflowOutputSchema from './workflow_output.schema.json';

const ajv = new Ajv({ allErrors: true });

export const validateFixedFilters = ajv.compile(fixedFiltersSchema);
export const validateKeywordPlan = ajv.compile(keywordSchema);
export const validateWorkflowInput = ajv.compile(workflowInputSchema);
export const validateWorkflowOutput = ajv.compile(workflowOutputSchema);

export function assertValid(validator: ReturnType<typeof ajv.compile>, payload: unknown, name: string) {
  if (!validator(payload)) {
    throw new Error(`${name} validation failed: ${ajv.errorsText(validator.errors)}`);
  }
}
