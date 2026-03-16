import { evaluateResults } from '../src/orchestration/evaluator';
import { SearchPlan } from '../src/adapters/types';

const basePlan: SearchPlan = {
  fixed_filters: {
    current_city: [], expected_city: [], experience_min: null, experience_max: null,
    education: ['不限'], full_time_enroll: null, school_tier: ['不限'], age_min: null, age_max: null, gender: '不限', languages: ''
  },
  keyword_plan: { 职位: ['Java架构师'], 公司: ['京东'], 技能: ['Java'] }
};

describe('result evaluator', () => {
  test('too_many', () => {
    const ev = evaluateResults(basePlan, [{ id: '1', title: 'Java架构师', skills: ['Java'] }], 500);
    expect(ev.problems).toContain('too_many');
  });

  test('too_few', () => {
    const ev = evaluateResults(basePlan, [], 2);
    expect(ev.problems).toContain('too_few');
  });

  test('title_drift', () => {
    const ev = evaluateResults(basePlan, [{ id: '1', title: '销售经理', skills: ['Java'] }], 20);
    expect(ev.problems).toContain('title_drift');
  });

  test('skill_mismatch', () => {
    const ev = evaluateResults(basePlan, [{ id: '1', title: 'Java架构师', skills: ['Go'] }], 20);
    expect(ev.problems).toContain('skill_mismatch');
  });
});
