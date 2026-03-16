import { assertValid, validateWorkflowInput } from '../src/schemas/validate';

describe('schema validation', () => {
  test('invalid input should throw', () => {
    expect(() => assertValid(validateWorkflowInput, { history_context: {} }, 'workflow_input')).toThrow();
  });
});
