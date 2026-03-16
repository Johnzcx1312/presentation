import { KeywordPlan } from '../adapters/types';

const COMPANY_EXPANSION: Record<string, string[]> = {
  外企: ['宝洁', '联合利华', '西门子', '施耐德', '罗氏', '微软', 'IBM', '英特尔', '思科', '3M'],
  瑞幸: ['瑞幸咖啡', '库迪', 'Manner', '星巴克中国'],
  喜茶: ['喜茶', '奈雪的茶', '茶百道', '沪上阿姨']
};

export function decomposeKeywords(userCommand: string): KeywordPlan {
  const plan: KeywordPlan = { 职位: [], 公司: [] };
  const dynamic: Record<string, string[]> = {};

  if (/Java.?架构师/.test(userCommand)) plan.职位.push('Java架构师', '技术架构师');
  if (/产品经理/.test(userCommand)) plan.职位.push('产品经理');
  if (/销售经理/.test(userCommand)) plan.职位.push('销售经理');
  if (/Python.?开发/.test(userCommand)) plan.职位.push('Python开发工程师');
  if (/CIO/.test(userCommand)) plan.职位.push('首席信息官', 'IT总监', '信息技术总监');
  if (/运营/.test(userCommand)) plan.职位.push('品牌运营', '连锁运营');
  if (/销售分析/.test(userCommand)) plan.职位.push('销售分析', '商业分析');
  if (/人力资源/.test(userCommand)) plan.职位.push('人力资源', 'HRBP');

  if (/京东/.test(userCommand)) plan.公司.push('京东');
  if (/阿特斯/.test(userCommand)) plan.公司.push('阿特斯');
  if (/物流/.test(userCommand)) plan.公司.push('顺丰', '京东物流', '德邦');
  for (const [k, v] of Object.entries(COMPANY_EXPANSION)) {
    if (userCommand.includes(k)) plan.公司.push(...v);
  }

  if (/供应链/.test(userCommand)) dynamic['业务方向'] = ['供应链', '仓储', '物流'];
  if (/医疗行业销售|医疗.*销售/.test(userCommand)) {
    dynamic['行业'] = ['医疗'];
    dynamic['技能'] = ['销售'];
  }
  if (/ToC|C端/.test(userCommand) && !/不要\s*B端/.test(userCommand)) dynamic['业务方向'] = ['C端'];
  if (/不要\s*B端/.test(userCommand)) dynamic['排除'] = ['B端', '企业服务'];
  if (/数字化转型/.test(userCommand)) dynamic['业务方向'] = ['数字化转型', '信息化建设'];
  if (/英语/.test(userCommand)) dynamic['技能'] = [...(dynamic['技能'] ?? []), '英语'];

  if (/招聘方[:：](\S+)/.test(userCommand)) {
    const own = userCommand.match(/招聘方[:：](\S+)/)?.[1];
    if (own) {
      plan.公司 = plan.公司.filter((c) => !c.includes(own));
    }
  }

  const fixedFieldNoise = ['北京', '上海', '35岁', '统招本科', '年龄', '学历'];
  for (const noise of fixedFieldNoise) {
    if (plan.职位.includes(noise)) plan.职位 = plan.职位.filter((x) => x !== noise);
  }

  const result: KeywordPlan = { 职位: dedup(plan.职位), 公司: dedup(plan.公司) };
  for (const [k, v] of Object.entries(dynamic)) {
    if (v.length > 0) result[k] = dedup(v);
  }
  return result;
}

function dedup<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
