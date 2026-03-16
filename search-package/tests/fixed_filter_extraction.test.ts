import { extractFixedFilters } from '../src/orchestration/fixed_filter_extractor';

describe('fixed filter extraction', () => {
  test('Case A nested msg JSON + add city + linkage', () => {
    const history = { ext: { extBody: { bizData: { msg: '[{"type":"other","dataList":[{"text":"统招要求:统招本科"},{"text":"期望城市:上海"}]}' } } } };
    const output = extractFixedFilters(history, '再加个北京');
    expect(output.expected_city).toEqual(expect.arrayContaining(['上海', '北京']));
    expect(output.full_time_enroll).toBe('统招本科');
    expect(output.education).toEqual(expect.arrayContaining(['本科', '硕士', '博士/博士后']));
  });

  test('Case B relax education and remove age cap', () => {
    const output = extractFixedFilters({ education: ['本科', '硕士'], age_max: 30 }, '学历放宽一点，年龄不要限制了');
    expect(output.education).toEqual(['大专', '本科', '硕士', '博士/博士后']);
    expect(output.age_max).toBeNull();
  });
});
