import { decomposeKeywords } from '../src/orchestration/keyword_decomposer';

describe('keyword decomposition golden cases', () => {
  test('京东 + Java 架构师 + 供应链', () => {
    const plan = decomposeKeywords('京东出来的Java架构师，懂供应链');
    expect(plan.职位).toEqual(expect.arrayContaining(['Java架构师']));
    expect(plan.公司).toContain('京东');
    expect(plan['业务方向']).toEqual(expect.arrayContaining(['供应链']));
  });

  test('产品经理，不要B端，要ToC', () => {
    const plan = decomposeKeywords('产品经理，不要 B 端，要 ToC');
    expect(plan.职位).toContain('产品经理');
    expect(plan['排除']).toEqual(expect.arrayContaining(['B端']));
  });

  test('医疗行业销售经理复合词拆分', () => {
    const plan = decomposeKeywords('医疗行业销售经理');
    expect(plan['行业']).toContain('医疗');
    expect(plan['技能']).toContain('销售');
  });

  test('固定字段不注入关键词', () => {
    const plan = decomposeKeywords('35 岁以下、统招本科、会英语的 Python 开发');
    expect(plan.职位).toContain('Python开发工程师');
    expect(JSON.stringify(plan)).not.toContain('35岁');
    expect(JSON.stringify(plan)).not.toContain('统招本科');
  });

  test('CIO 简历语言转换', () => {
    const plan = decomposeKeywords('企业数字化转型 CIO');
    expect(plan.职位).toEqual(expect.arrayContaining(['IT总监', '信息技术总监', '首席信息官']));
  });

  test('瑞幸/喜茶公司扩展', () => {
    const plan = decomposeKeywords('瑞幸 / 喜茶类连锁品牌运营');
    expect(plan.公司).toEqual(expect.arrayContaining(['瑞幸咖啡', '奈雪的茶']));
  });

  test('外企标签展开 + 阿特斯 + 销售分析', () => {
    const plan = decomposeKeywords('阿特斯 + 外企 + 销售分析');
    expect(plan.公司).toEqual(expect.arrayContaining(['阿特斯', '微软']));
  });

  test('关键词：人力资源；公司：物流', () => {
    const plan = decomposeKeywords('关键词：人力资源；公司：物流');
    expect(plan.职位).toEqual(expect.arrayContaining(['人力资源']));
    expect(plan.公司).toEqual(expect.arrayContaining(['顺丰']));
  });

  test('JD场景招聘方公司自我排除', () => {
    const plan = decomposeKeywords('招聘方:京东 我们是京东，招聘供应链经理');
    expect(plan.公司).not.toContain('京东');
  });
});
