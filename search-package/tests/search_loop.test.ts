import { MockResumeSearchAdapter } from '../src/adapters/mock_resume_search_adapter';
import { runSearchLoop } from '../src/orchestration/search_loop';

describe('search loop', () => {
  test('first round success', async () => {
    const adapter = new MockResumeSearchAdapter(() => ({ total: 10, results: [{ id: '1', title: 'Java架构师', skills: ['Java'] }] }));
    const out = await runSearchLoop({ user_command: '京东 Java架构师', history_context: {} }, adapter);
    expect(out.status).toBe('success');
    expect(out.iterations_used).toBe(1);
  });

  test('second round success after rewrite', async () => {
    let i = 0;
    const adapter = new MockResumeSearchAdapter(() => {
      i += 1;
      return i === 1 ? { total: 2, results: [] } : { total: 12, results: [{ id: '2', title: 'Java架构师', skills: ['Java'] }] };
    });
    const out = await runSearchLoop({ user_command: '京东 Java架构师', history_context: {} }, adapter);
    expect(out.status).toBe('success');
    expect(out.iterations_used).toBe(2);
  });

  test('partial after 3 rounds', async () => {
    const adapter = new MockResumeSearchAdapter(() => ({ total: 1, results: [] }));
    const out = await runSearchLoop({ user_command: '冷门岗位', history_context: {}, options: { max_iterations: 3 } }, adapter);
    expect(out.status).toBe('failed');
    expect(out.iterations_used).toBeGreaterThanOrEqual(1);
  });

  test('avoid duplicate query infinite loop', async () => {
    const adapter = new MockResumeSearchAdapter(() => ({ total: 1000, results: [{ id: '1', title: '泛岗位', skills: [] }] }));
    const out = await runSearchLoop({ user_command: '泛岗位', history_context: {}, options: { max_iterations: 3 } }, adapter);
    expect(out.iterations_used).toBeLessThanOrEqual(3);
  });
});
