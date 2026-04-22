const DEFAULT_MODEL = 'moonshot-v1-8k';

function getApiKey() {
  return import.meta.env?.VITE_KIMI_API_KEY || '';
}

const SYSTEM_PROMPT = `# Role
你是一个精通招聘搜索逻辑的算法专家，专注于将用户的模糊描述、职位JD或口语化要求转化为高召回、高精准的结构化搜索条件。

# Core Philosophy（核心设计哲学）
在提取关键词时，必须严格遵守以下三大铁律：

1. 增量优先与反包含
- 严禁输出仅仅是对原始词做无意义延长的"长词"。
- 收敛翻译：严禁进行无意义翻译（如 "天津" -> "Tianjin", "居然之家" -> "Easyhome"）。
- 只有当英文是行业通用的高频缩写、简历中常见写法或外企常用标准名时才可输出（如 "Java", "HRBP", "SaaS", "ByteDance"）。

2. 简历语言对齐
- 输出词汇必须是候选人简历中高频书写、真实可检索的词汇。

3. 实体逻辑智能转换
- 类型转实体：当用户输入"外企""造车新势力""互联网大厂"等公司类型词时，不要直接输出该类型词，而是展开为该类型下的 10-20 个代表性公司名。
- 招聘方排除：输入中可能包含对招聘方自己的介绍，严禁将其放入"公司"搜索字段，避免搜到自己公司的员工。

# Goals
你的任务是从用户输入中提炼关键词，构建布尔搜索逻辑：
- 同一维度内：关键词为 OR 关系。
- 不同维度之间：关键词为 AND 关系。
- 维度数量：控制在 2-4 个。
- 输出结果应尽量兼顾召回与精准，保留搜索主轴，不做无依据发散。

# Context Understanding（上下文理解方式）
你接收到的不是单一纯文本，而是当前用户输入与历史结构化对话。

历史对话中，部分用户消息除了文本外，还可能包含 \`<quote>\` 字段：
- \`<quote>\` 表示用户在该轮主动引用的当前搜索条件组。
- \`<quote>\` 是可选上下文，不是每轮都会出现。
- 当 \`<quote>\` 存在且与当前输入相关时，可用于补全该轮真实搜索意图。
- 当 \`<quote>\` 不存在时，按当前用户输入正常理解即可，不要主动假设有引用条件。
- 不要因为历史中存在 \`<quote>\`，就默认继承整组旧条件。

使用上下文时，遵守以下原则：
1. 优先理解当前用户输入。
2. 若当前输入中出现"这些 / 这个方向 / 按这些 / 也加点 / 再补一些 / 类似的 / 这种 / 这一类"等指代、省略或延续表达，且相关轮次存在 \`<quote>\`，可结合 \`<quote>\` 补全语义。
3. 若当前用户输入已经完整表达需求，应以当前输入为主，\`<quote>\` 仅作辅助参考，不要机械带入其中全部条件。
4. 若不同轮次存在多个 \`<quote>\`，仅在确有必要时，优先参考最近一轮且与当前输入直接相关的 \`<quote>\`。
5. 若当前用户输入与旧的 \`<quote>\` 或历史信息冲突，以当前用户输入为准。

# Input Processing
1. 职位 / 技能描述
- 提炼职位词与技能关键词。
- 从口语、JD、简称中映射为简历高频写法。

2. 公司 / 行业要求
- 提炼具体公司名。
- 若用户给的是行业 / 类型 / 集合标签，则转化为具体公司列表，必要时补充行业或业务方向维度。

3. 固定字段（严格屏蔽）
- 严禁输出城市 / 地区（如天津、上海、北京）、薪资、年限、学历、性别、年龄等固定字段。
- 若这些信息出现在当前输入或 \`<quote>\` 中，只能用于理解上下文，不得进入输出 JSON。

4. quote 的使用边界
- 若当前输入信息不足，且相关 \`<quote>\` 能补足岗位、公司、技能、行业等关键信息，可使用 \`<quote>\`。
- 若当前输入已完整表达意图，不要因为存在 \`<quote>\` 而强行带入旧条件。
- 仅在必要时使用 \`<quote>\` 补全语义，不要默认继承整组条件。

# Output Format & Rules
仅输出一个标准 JSON 对象。

JSON 结构规则：
1. \`职位\`：字符串数组（必填，无内容则为 []）。
2. \`公司\`：字符串数组（必填，无内容则为 []）。
3. 动态维度：
   - 根据内容提取 0-2 个额外维度（如 \`技能\`、\`行业\`、\`业务方向\`、\`分析方向\`、\`职责重点\`、\`专业技能\`）。
   - 如果某动态维度为空，请直接不输出该 Key，不要输出 \`"行业": []\` 这种空字段。
4. 不要使用 Markdown 标记，不要包含任何解释性文字。
5. 输出必须是合法、可解析的 JSON。

# Dimension Logic（维度拆解逻辑）

## 1. 职位维度（Job Title）
策略：中文优先、意图映射、层级对齐。
- 提取原话中的职位词；必要时结合相关 \`<quote>\` 补足职位主语。
- 可扩展同义词、高频简称、简历常见写法（如 "PM"）。
- 职位扩展应与原意层级接近，不要无依据升降级。

## 2. 公司维度（Company）- 智能扩展
策略：同心圆法则 + 类型展开

1. 具体公司
- 保留原名。
- 可扩展核心别名、英文名、集团子品牌、简历常见写法（如 "字节" -> "字节跳动", "ByteDance"）。

2. 公司类型 / 集合词（重要）
- 若用户输入"外企""大厂""互联网头部""新能源车企""连锁品牌"等集合概念：
- 不要输出"外企"这类集合词本身。
- 必须输出该集合下 10-20 个代表性公司名。

3. JD 场景排除
- 若输入是 JD，请识别 JD 中的"招聘方 / 介绍方"。
- 不要把该招聘公司加入搜索条件。

4. quote 辅助理解
- 若用户当前话术是"按这些再加一点""类似这种公司"等，可结合相关 \`<quote>\` 识别公司主轴与扩展方向。
- 但若当前输入已明确改了方向，不要继续沿用旧公司条件。

## 3. 其他关键词维度
策略：提取 1-2 个核心筛选维度（技能、行业、产品、方向、职责等）。
- 去噪：剔除"沟通能力""抗压""吃苦耐劳""责任心强"等低检索价值通用词。
- 结构化：必要时拆分复合语义（如"医疗销售" -> 行业 / 业务方向 + 职位）。
- 当前输入信息不足时，可从相关 \`quote\` 中补足核心维度。
- 不要滥加维度，总维度仍控制在 2-4 个。

# Few-Shot Examples（Examples of Truth）

## Case 1: 标准组合（职位+公司+技能+行业）
Input: "找一个京东出来的Java架构师，懂供应链，最好带过团队"
Output:
{
  "职位": ["架构师", "Architect", "技术经理", "Tech Lead"],
  "公司": ["京东", "JD", "京东物流", "京东科技"],
  "技能": ["Java", "J2EE", "JVM", "高并发", "微服务"],
  "业务方向": ["供应链", "Supply Chain", "仓储", "物流", "WMS"]
}

## Case 2: 排除逻辑（Negative Logic）
Input: "找个产品经理，不要做B端的，要ToC的"
Output:
{
  "职位": ["产品经理", "PM", "Product Manager", "产品策划"],
  "公司": [],
  "业务方向": ["ToC", "C端", "消费互联网", "用户端", "App"]
}

## Case 3: 复合词拆分（Split Strategy）
Input: "医疗行业的销售经理"
Output:
{
  "职位": ["销售经理", "Sales Manager", "大区经理", "销售总监"],
  "公司": [],
  "行业": ["医疗", "Medical", "器械", "医药", "大健康", "IVD"]
}

## Case 4: 固定条件提取
Input: "35岁以下，统招本科，会英语的Python开发"
Output:
{
  "职位": ["Python开发", "Python工程师", "后端开发", "Software Engineer"],
  "公司": [],
  "固定条件": {"年龄": "25-35", "学历": "本科"},
  "技能": ["Python", "Django", "Flask", "Pandas", "PyTorch"]
}

## Case 5: 地点和年限提取
Input: "帮我找3-5年Java工程师，base北京，本科以上"
Output:
{
  "职位": ["Java开发", "Java工程师", "后端开发"],
  "公司": [],
  "固定条件": {"地点": "北京", "年限": "3-5年", "学历": "本科"},
  "技能": ["Java", "Spring", "JVM"]
}

## Case 5: 简历语言转换（Resume-Speak）
Input: "找个做过企业数字化转型的CIO"
Output:
{
  "职位": ["CIO", "IT总监", "信息技术总监", "首席信息官"],
  "公司": [],
  "职责重点": ["数字化", "ERP", "SAP", "Oracle", "流程重组", "中台", "信息化"]
}

## Case 6: 公司扩展（Explicit Expansion）
Input: "看看像瑞幸、喜茶这类连锁品牌的运营"
Output:
{
  "职位": ["运营", "Operations", "门店经理", "区域经理"],
  "公司": ["瑞幸", "Luckin", "喜茶", "HeyTea", "奈雪的茶", "星巴克", "蜜雪冰城", "霸王茶姬"],
  "行业": ["连锁餐饮", "新茶饮", "咖啡", "快消", "零售"]
}

## Case 7: 类型标签 -> 实体展开（Type Expansion）
Input: "帮我找销售分析的人，要阿特斯的，再加点外企相关的"
Output:
{
  "职位": ["销售分析师", "数据分析师", "业务分析师", "Sales Analyst"],
  "公司": ["阿特斯", "Canadian Solar", "IBM", "微软", "谷歌", "亚马逊", "特斯拉", "强生", "辉瑞", "宝洁", "欧莱雅", "西门子", "施耐德"],
  "分析方向": ["销售分析", "销售数据", "业务洞察", "业绩分析"]
}

## Case 8: 动态字段判空（Clean JSON）
Input: "关键词：人力资源 公司：物流"
Output:
{
  "职位": ["HR", "人力资源", "人事", "招聘", "培训", "HRBP"],
  "公司": ["顺丰", "京东物流", "中通", "圆通", "极兔", "德邦"],
  "行业": ["物流", "供应链", "快递", "仓储"]
}

## Case 9: JD 场景 & 自我排除（Self-Exclusion）
Input: （一段关于"松川机械"招聘技术主管的JD，提及了松川的福利和介绍）
Output:
{
  "职位": ["技术主管", "Technical Lead", "研发主管", "机械设计经理", "电气主管"],
  "公司": [],
  "行业": ["医药", "制药", "包装机械", "自动化设备", "智能制造"],
  "专业技能": ["高速装盒机", "GMP", "机器手", "电气控制", "PLC"]
}

## Case 10: 当前文本较短，需结合 quote 理解
Input:
当前用户文本: "按这些再加点外企相关的"
相关 quote: "职位=销售分析；公司=阿特斯"
Output:
{
  "职位": ["销售分析师", "数据分析师", "业务分析师", "Sales Analyst"],
  "公司": ["阿特斯", "Canadian Solar", "IBM", "微软", "谷歌", "亚马逊", "特斯拉", "强生", "辉瑞", "宝洁", "欧莱雅", "西门子", "施耐德"],
  "分析方向": ["销售分析", "销售数据", "业务洞察", "业绩分析"]
}

## Case 11: quote 提供主语，当前文本只表达补充方向
Input:
当前用户文本: "这个方向也补点技能"
相关 quote: "职位=Java后端开发；公司=京东"
Output:
{
  "职位": ["Java后端开发", "Java开发", "后端开发", "Software Engineer"],
  "公司": ["京东", "JD", "京东物流", "京东科技"],
  "技能": ["Java", "Spring Boot", "Spring Cloud", "微服务", "高并发", "分布式", "JVM"]
}

## Case 12: 存在旧 quote，但当前输入已改意图
Input:
当前用户文本: "不要销售分析了，改财务分析"
相关 quote: "职位=销售分析；公司=阿特斯；分析方向=销售数据"
Output:
{
  "职位": ["财务分析", "财务分析师", "FP&A", "Finance Analyst"],
  "公司": [],
  "技能": ["财务分析", "预算", "报表分析", "经营分析", "数据分析"]
}

# Environment
当前用户输入为本轮用户最新消息。
历史对话信息为结构化消息列表，其中部分用户消息可能带有 \`quote\` 字段。

<history_dialogue>
{{dialog}}
</history_dialogue>

<quote>
{{quote}}
</quote>

# 最终指令
请根据以上历史与规则，提取关键词并输出唯一的 JSON 结果（不要包含任何 Markdown 标记或额外解释）：`;

function formatHistoryForPrompt(history) {
  if (!history || history.length === 0) return '无';
  return history
    .map((h, idx) => {
      const round = idx + 1;
      const userText = h.user || h.content || '';
      const aiText = h.ai || '';
      const quote = h.quote ? `\n<quote>${JSON.stringify(h.quote)}</quote>` : '';
      return `第${round}轮：\n用户：${userText}${quote}\nAI：${aiText}`;
    })
    .join('\n\n');
}

function buildQuoteFromExpanded(expanded) {
  if (!expanded) return '';
  const quote = {};
  if (expanded.expanded?.positions?.length) {
    quote.职位 = expanded.expanded.positions.slice(0, 3);
  }
  if (expanded.expanded?.companies?.length) {
    quote.公司 = expanded.expanded.companies.slice(0, 5);
  }
  if (expanded.expanded?.skills?.length) {
    quote.技能 = expanded.expanded.skills.slice(0, 5);
  }
  return Object.keys(quote).length > 0 ? JSON.stringify(quote) : '';
}

export async function kimiAgentChat({ userText, history = [], previousExpanded = null }) {
  const apiKey = getApiKey();

  // 构建 quote
  const quote = buildQuoteFromExpanded(previousExpanded);

  if (!apiKey) {
    // 本地降级
    return mockAgentResponse(userText, history, quote);
  }

  const historyStr = formatHistoryForPrompt(history);
  const systemPrompt = SYSTEM_PROMPT
    .replace('{{date}}', new Date().toISOString().split('T')[0])
    .replace('{{dialog}}', historyStr)
    .replace('{{quote}}', quote || '无');

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userText },
  ];

  try {
    const resp = await fetch('/moonshot/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 500,
        stream: false,
      }),
    });

    if (!resp.ok) throw new Error('API error');

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || '';

    // 解析 JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        task: '关键词扩展',
        msg: '',
        keywords: parsed,
        shouldExpand: true,
      };
    }

    throw new Error('JSON parse failed');
  } catch (e) {
    return mockAgentResponse(userText, history, quote);
  }
}

// 本地降级：模拟关键词提取（含固定条件）
function mockAgentResponse(userText, history, quote) {
  const hasPosition = /Java|Python|前端|后端|产品|运营|测试|算法|架构|总监|经理|工程师|专员|HR|财务|销售|分析/i.test(userText);
  const hasCompany = /字节|阿里|腾讯|美团|京东|百度|快手|拼多多|小红书|滴滴|网易|小米|华为|外企|大厂/i.test(userText);

  // 本地解析职位
  const positions = [];
  const companies = [];
  const skills = [];
  
  // 固定条件提取
  const fixedConditions = {};

  // 职位提取
  if (/Java/i.test(userText)) positions.push('Java开发', 'Java工程师', '后端开发');
  if (/Python/i.test(userText)) positions.push('Python开发', 'Python工程师');
  if (/前端/i.test(userText)) positions.push('前端开发', 'Web前端', '前端工程师');
  if (/产品/i.test(userText)) positions.push('产品经理', 'PM', '产品专员');
  if (/运营/i.test(userText)) positions.push('运营', '用户运营', '内容运营');
  if (/销售/i.test(userText)) positions.push('销售', '销售经理', 'Sales');
  if (/HR|人事|人力资源/i.test(userText)) positions.push('HR', '人力资源', '招聘', 'HRBP');
  if (/财务|会计/i.test(userText)) positions.push('财务', '会计', '财务分析', 'FP&A');
  if (/分析|数据/i.test(userText)) positions.push('数据分析师', '业务分析师', 'Data Analyst');

  // 如果没有提取到职位，给个默认值
  if (positions.length === 0 && hasPosition) {
    positions.push('工程师', '开发');
  }

  // 公司提取
  if (/字节|ByteDance/i.test(userText)) companies.push('字节跳动', 'ByteDance', '抖音', 'TikTok');
  if (/阿里|阿里巴巴/i.test(userText)) companies.push('阿里巴巴', '阿里', '淘宝', '天猫', '支付宝');
  if (/腾讯/i.test(userText)) companies.push('腾讯', '微信', 'QQ');
  if (/美团/i.test(userText)) companies.push('美团', '大众点评');
  if (/京东|JD/i.test(userText)) companies.push('京东', 'JD', '京东物流');
  if (/百度/i.test(userText)) companies.push('百度', 'Baidu');
  if (/快手/i.test(userText)) companies.push('快手', 'Kuaishou');
  if (/拼多多/i.test(userText)) companies.push('拼多多', 'PDD');
  if (/小红书/i.test(userText)) companies.push('小红书', 'RED');
  if (/滴滴/i.test(userText)) companies.push('滴滴', 'DiDi');
  if (/网易/i.test(userText)) companies.push('网易', 'NetEase');
  if (/小米/i.test(userText)) companies.push('小米', 'Xiaomi');
  if (/华为/i.test(userText)) companies.push('华为', 'Huawei');

  // 类型展开
  if (/外企|外资|跨国公司/i.test(userText)) {
    companies.push('IBM', '微软', '谷歌', '亚马逊', '特斯拉', '强生', '辉瑞', '宝洁', '欧莱雅', '西门子', '施耐德', '埃森哲');
  }
  if (/大厂|互联网头部/i.test(userText)) {
    companies.push('字节跳动', '阿里巴巴', '腾讯', '美团', '京东', '百度', '快手', '拼多多', '小红书', '滴滴', '网易', '小米');
  }

  // 技能提取
  if (/微服务/i.test(userText)) skills.push('微服务', 'Spring Cloud', 'Dubbo');
  if (/分布式/i.test(userText)) skills.push('分布式', '分布式系统', '中间件');
  if (/Spring/i.test(userText)) skills.push('Spring', 'Spring Boot', 'Spring Cloud');
  if (/MySQL|数据库/i.test(userText)) skills.push('MySQL', '数据库', 'SQL');
  if (/Redis/i.test(userText)) skills.push('Redis', '缓存');
  if (/Kafka|消息队列/i.test(userText)) skills.push('Kafka', '消息队列', 'MQ');
  if (/React/i.test(userText)) skills.push('React', '前端框架');
  if (/Vue/i.test(userText)) skills.push('Vue', 'Vue.js');
  if (/高并发/i.test(userText)) skills.push('高并发', '性能优化');

  // 如果没有技能但有职位，给个默认技能
  if (skills.length === 0 && positions.length > 0) {
    if (positions.some(p => /Java/i.test(p))) skills.push('Java', 'Spring');
    if (positions.some(p => /Python/i.test(p))) skills.push('Python', 'Django');
    if (positions.some(p => /前端/i.test(p))) skills.push('JavaScript', 'React', 'Vue');
    if (positions.some(p => /产品/i.test(p))) skills.push('需求分析', '原型设计');
    if (positions.some(p => /数据|分析/i.test(p))) skills.push('SQL', '数据分析', 'Excel');
  }

  // 提取固定条件：地点
  const cities = ['北京', '上海', '深圳', '广州', '杭州', '成都', '武汉', '西安', '苏州', '南京'];
  for (const city of cities) {
    if (userText.includes(city)) {
      fixedConditions.地点 = city;
      break;
    }
  }

  // 提取固定条件：工作年限
  const yearMatch = userText.match(/(\d+)[\-\s]*(?:年|年以上|年经验|年工作)/);
  if (yearMatch) {
    const years = parseInt(yearMatch[1]);
    if (years >= 5) fixedConditions.年限 = '5-10年';
    else if (years >= 3) fixedConditions.年限 = '3-5年';
    else if (years >= 1) fixedConditions.年限 = '1-3年';
  }
  // 范围匹配如 "3-5年"
  const rangeMatch = userText.match(/(\d+)[\-\s]*(\d+)\s*年/);
  if (rangeMatch) {
    fixedConditions.年限 = `${rangeMatch[1]}-${rangeMatch[2]}年`;
  }

  // 提取固定条件：学历
  if (/本科/.test(userText)) fixedConditions.学历 = '本科';
  else if (/硕士/.test(userText)) fixedConditions.学历 = '硕士';
  else if (/博士/.test(userText)) fixedConditions.学历 = '博士';
  else if (/专科|大专/.test(userText)) fixedConditions.学历 = '大专';

  // 提取固定条件：年龄
  const ageMatch = userText.match(/(\d+)[\-\s]*岁/);
  if (ageMatch) {
    fixedConditions.年龄 = ageMatch[1];
  }
  const ageRangeMatch = userText.match(/(\d+)[\-\s]*(\d+)\s*岁/);
  if (ageRangeMatch) {
    fixedConditions.年龄 = `${ageRangeMatch[1]}-${ageRangeMatch[2]}`;
  }

  // 提取固定条件：性别
  if (/男/.test(userText) && !/女/.test(userText)) fixedConditions.性别 = '男';
  if (/女/.test(userText) && !/男/.test(userText)) fixedConditions.性别 = '女';

  // 构建返回
  const keywords = {
    职位: positions,
    公司: companies,
  };
  if (skills.length > 0) keywords.技能 = skills;
  
  // 添加固定条件（如果有）
  if (Object.keys(fixedConditions).length > 0) {
    keywords.固定条件 = fixedConditions;
  }

  return {
    task: '关键词扩展',
    msg: '',
    keywords,
    shouldExpand: positions.length > 0,
  };
}

// 扩展关键词（用于本地生成模拟数据）
export function expandKeywords(conditions, keywordResult) {
  // 如果 Agent 返回了关键词，优先使用
  if (keywordResult?.keywords) {
    const result = {
      original: conditions,
      expanded: {
        positions: keywordResult.keywords.职位 || [],
        companies: keywordResult.keywords.公司 || [],
        skills: keywordResult.keywords.技能 || [],
        industries: keywordResult.keywords.行业 || [],
      },
      raw: keywordResult.keywords,
    };
    
    // 提取固定条件
    if (keywordResult.keywords.固定条件) {
      result.fixedConditions = keywordResult.keywords.固定条件;
    }
    
      return result;
  }

  // 降级：基于 conditions 本地扩展
  const result = {
    original: conditions,
    expanded: {
      positions: [],
      companies: [],
      skills: [],
      industries: [],
    },
    raw: {},
    fixedConditions: {},
  };

  if (conditions.position) {
    const pos = conditions.position.toLowerCase();
    if (pos.includes('java')) {
      result.expanded.positions = ['Java开发', 'Java工程师', '后端开发', '服务端开发'];
      result.expanded.skills = ['Java', 'Spring', 'SpringBoot', 'MySQL', 'Redis', '微服务'];
      result.expanded.companies = ['字节跳动', '阿里巴巴', '美团', '京东', '百度'];
    } else if (pos.includes('前端')) {
      result.expanded.positions = ['前端开发', 'Web前端', '前端工程师', 'H5开发'];
      result.expanded.skills = ['JavaScript', 'TypeScript', 'React', 'Vue', 'HTML5', 'CSS3'];
      result.expanded.companies = ['腾讯', '字节跳动', '美团', '百度', '快手'];
    } else if (pos.includes('产品')) {
      result.expanded.positions = ['产品经理', '产品专员', 'PM', '产品运营'];
      result.expanded.skills = ['需求分析', '数据分析', '原型设计', '用户研究', 'Axure'];
      result.expanded.companies = ['字节跳动', '腾讯', '阿里巴巴', '美团', '拼多多'];
    } else if (pos.includes('运营')) {
      result.expanded.positions = ['运营', '用户运营', '内容运营', '活动运营'];
      result.expanded.skills = ['数据分析', '用户增长', '内容运营', '活动策划'];
      result.expanded.companies = ['字节跳动', '小红书', '美团', '滴滴', '拼多多'];
    } else if (pos.includes('销售')) {
      result.expanded.positions = ['销售', '销售经理', '大客户销售', 'Sales'];
      result.expanded.skills = ['销售技巧', '客户开发', '商务谈判', 'CRM'];
      result.expanded.companies = ['阿里巴巴', '华为', '腾讯', '字节跳动', '京东'];
    } else if (pos.includes('数据') || pos.includes('分析')) {
      result.expanded.positions = ['数据分析师', '业务分析师', '数据分析', '商业分析'];
      result.expanded.skills = ['SQL', 'Python', 'Excel', 'Tableau', '数据分析'];
      result.expanded.companies = ['字节跳动', '阿里巴巴', '美团', '京东', '拼多多'];
    } else if (pos.includes('财务') || pos.includes('会计')) {
      result.expanded.positions = ['财务', '会计', '财务分析', '财务主管', 'FP&A'];
      result.expanded.skills = ['财务分析', '预算', '报表', 'CPA', '财务建模'];
      result.expanded.companies = ['四大', '华为', '阿里巴巴', '腾讯', '字节跳动'];
    } else if (pos.includes('hr') || pos.includes('人事') || pos.includes('人力资源')) {
      result.expanded.positions = ['HR', '人力资源', '招聘', 'HRBP', '人事'];
      result.expanded.skills = ['招聘', '人才发展', '绩效管理', '薪酬设计'];
      result.expanded.companies = ['字节跳动', '阿里巴巴', '腾讯', '华为', '美团'];
    } else {
      result.expanded.positions = [conditions.position, conditions.position + '师', conditions.position + '专员', conditions.position + '经理'];
      result.expanded.skills = conditions.skills || ['专业技能'];
      result.expanded.companies = ['互联网大厂'];
    }
  }

  // 补充技能
  if (conditions.skills?.length > 0) {
    result.expanded.skills = [...new Set([...result.expanded.skills, ...conditions.skills])];
  }

  // 地点相关公司
  const cityCompanies = {
    '北京': ['字节跳动', '美团', '京东', '百度', '快手', '小米', '滴滴'],
    '上海': ['拼多多', '小红书', '饿了么', '携程', '哔哩哔哩', '得物'],
    '深圳': ['腾讯', '华为', '大疆', '顺丰', '微众银行', 'OPPO', 'vivo'],
    '杭州': ['阿里巴巴', '网易', '蚂蚁集团', '有赞', '菜鸟网络'],
    '广州': ['微信', '网易', '虎牙', '小鹏汽车', '唯品会'],
  };

  if (conditions.location && cityCompanies[conditions.location]) {
    result.expanded.companies = [...new Set([...result.expanded.companies, ...cityCompanies[conditions.location]])];
  }

  return result;
}

export default {
  kimiAgentChat,
  expandKeywords,
};
