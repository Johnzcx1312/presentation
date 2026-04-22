/**
 * 猎聘企业版真实 API Service
 * 对接 OpenClaw 提供的简历搜索接口
 */

// 使用 Vite 代理路径（避免 CORS）
const API_BASE = '/liepin';
const TOKEN = 'q27IgFFHjrqUSZHS';

/**
 * 构建 boolSearchJsonStr
 * 根据 AI 拆解的关键词构建搜索条件
 */
function buildSearchJson(conditions) {
  const searchObj = {
    // 分页
    pageSize: 20,
    pageNo: 1,

    // 默认过滤（排除已沟通/已下载/已查看）
    filterChat: 1,
    filterDownload: 1,
    filterRead: 1,

    // 性别（如有）
    sex: conditions.sex || undefined,

    // 年龄范围（如有）
    ageLow: conditions.ageLow || undefined,
    ageHigh: conditions.ageHigh || undefined,

    // 当前地区（英文逗号分隔）
    dqs: conditions.dqs || undefined,

    // 期望地区（英文逗号分隔）
    wantDqs: conditions.wantDqs || undefined,

    // 工作年限
    workYearLow: conditions.workYearLow || undefined,
    workYearHigh: conditions.workYearHigh || undefined,

    // 学历（空格分隔多个）
    eduLevel: conditions.eduLevel || undefined,

    // 目标公司（空格分隔多个）
    company: conditions.company || undefined,

    // 职位名称（空格分隔多个）
    jobTitle: conditions.jobTitle || undefined,

    // 布尔表达式关键词
    keyword: conditions.keyword || undefined,
  };

  // 移除 undefined 值
  Object.keys(searchObj).forEach(key => {
    if (searchObj[key] === undefined || searchObj[key] === null || searchObj[key] === '') {
      delete searchObj[key];
    }
  });

  return JSON.stringify({ boolSearchJsonStr: JSON.stringify(searchObj) });
}

/**
 * 搜索简历列表
 * @param {Object} conditions - 搜索条件
 * @returns {Promise<Array>} 简历列表（第一个元素包含 _total 总数量）
 */
export async function searchResumes(conditions) {
  try {
    const requestBody = buildSearchJson(conditions);

    const response = await fetch(`${API_BASE}/resume/search_resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`搜索失败: ${response.status}`);
    }

    const data = await response.json();

    // 获取总数量（如果 API 返回）
    const totalCount = data.total || data.totalCount || data.totalSize || 0;

    // 处理响应格式
    let results = [];
    if (Array.isArray(data)) {
      results = data.map(formatResumeSummary);
    } else if (data.data && Array.isArray(data.data)) {
      results = data.data.map(formatResumeSummary);
    } else if (data.records && Array.isArray(data.records)) {
      results = data.records.map(formatResumeSummary);
    }

    // 将总数量附加到第一个结果中（用于前端显示）
    if (results.length > 0) {
      results[0]._total = totalCount || results.length;
    } else if (totalCount > 0) {
      // 如果有总数但没有数据，创建一个虚拟条目保存总数
      results.push({ _total: totalCount, id: '_total_placeholder' });
    }

    return results;
  } catch (error) {
    console.error('猎聘搜索失败:', error);
    throw error;
  }
}

/**
 * 获取简历详情
 * @param {string} resIdEncode - 加密的简历ID
 * @returns {Promise<Object>} 简历详情
 */
export async function getResumeDetail(resIdEncode) {
  try {
    const response = await fetch(`${API_BASE}/resume/get_resume_detail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ resIdEncode }),
    });

    if (!response.ok) {
      throw new Error(`获取详情失败: ${response.status}`);
    }

    const data = await response.json();
    return formatResumeDetail(data);
  } catch (error) {
    console.error('获取简历详情失败:', error);
    throw error;
  }
}

/**
 * 格式化简历列表项（简化版）
 */
function formatResumeSummary(item) {
  return {
    id: item.resIdEncode,
    name: item.resName || '未知',
    age: item.age || 28,
    gender: item.sexName === '男' ? 'male' : item.sexName === '女' ? 'female' : 'male',
    isOnline: Math.random() > 0.7, // 猎聘接口不返回在线状态，模拟
    status: '在职-看机会',
    city: item.dqName || '北京',
    expectCity: item.expectDqName || item.dqName || '北京',
    experience: `${item.workYears || 3}年`,
    education: item.eduLevelName || '本科',
    expectPosition: item.expectJobtitleName || '工程师',
    salary: item.expectSalaryShowName || '面议',
    company: item.recentWorkList?.[0]?.companyName || '互联网大厂',
    // 工作经历
    workExperience: (item.recentWorkList || []).map(work => ({
      company: work.companyName,
      position: work.title,
      period: `${work.startDate} - ${work.endDate || '至今'}`,
      duration: `${work.workMonths || 12}个月`,
    })),
    // 技能标签（从期望职位和公司推断）
    tags: [
      item.expectJobtitleName,
      item.dqName,
      '互联网大厂',
    ].filter(Boolean),
  };
}

/**
 * 格式化简历详情
 */
function formatResumeDetail(data) {
  return {
    id: data.resIdEncode,
    name: data.resName,
    age: data.age,
    gender: data.sexName === '男' ? 'male' : 'female',
    education: data.eduLevelName,
    city: data.dqName,
    expectCity: data.expectList?.[0]?.expectDqName,
    expectPosition: data.expectList?.[0]?.expectJobtitleName,
    salary: data.expectList?.[0]?.expectSalaryShowName,
    company: data.currentWork?.companyName,
    // 完整工作经历
    workExperience: (data.workExperienceList || []).map(work => ({
      company: work.companyName,
      position: work.title,
      period: `${work.startDate} - ${work.endDate || '至今'}`,
      duration: `${work.workMonths}个月`,
      description: work.workDesc,
    })),
    // 教育经历
    educationList: (data.eduExperienceList || []).map(edu => ({
      school: edu.schoolName,
      major: edu.majorName,
      degree: edu.eduLevelName,
      period: `${edu.startDate} - ${edu.endDate}`,
    })),
    // 项目经验
    projectList: (data.projectExperienceList || []).map(proj => ({
      name: proj.projectName,
      role: proj.titleName,
      period: `${proj.startDate} - ${proj.endDate || '至今'}`,
      description: proj.projectDesc,
    })),
    // 自我评价
    selfAssessment: data.selfAssessment,
    // 技能标签
    tags: (data.skillList || []).map(s => s.skillName),
  };
}

/**
 * 将 AI 拆解的关键词转换为猎聘搜索条件
 * 支持从 aiKeywords.固定条件 或固定条件面板获取
 */
export function convertAiKeywordsToConditions(aiKeywords, fixedConditions = {}) {
  const conditions = {
    // 从固定条件面板获取
    dqs: fixedConditions.目前城市 && fixedConditions.目前城市 !== '不限'
      ? fixedConditions.目前城市
      : undefined,
    wantDqs: fixedConditions.期望城市 && fixedConditions.期望城市 !== '不限'
      ? fixedConditions.期望城市
      : undefined,
    workYearLow: undefined,
    workYearHigh: undefined,
    eduLevel: fixedConditions.学历 && fixedConditions.学历 !== '不限'
      ? fixedConditions.学历
      : undefined,
  };

  // 处理固定条件面板的工作年限
  if (fixedConditions.经验 && fixedConditions.经验 !== '不限') {
    const expMatch = fixedConditions.经验.match(/(\d+)[-\s]*(\d+)?/);
    if (expMatch) {
      conditions.workYearLow = expMatch[1];
      conditions.workYearHigh = expMatch[2] || parseInt(expMatch[1]) + 2;
    }
  }

  // 处理 AI 返回的固定条件（优先级更高）
  const aiFixedConditions = aiKeywords?.固定条件 || {};
  
  // 地点/城市
  if (aiFixedConditions.地点 || aiFixedConditions.城市) {
    conditions.dqs = aiFixedConditions.地点 || aiFixedConditions.城市;
  }
  
  // 期望城市
  if (aiFixedConditions.期望地点 || aiFixedConditions.期望城市) {
    conditions.wantDqs = aiFixedConditions.期望地点 || aiFixedConditions.期望城市;
  }
  
  // 工作年限
  if (aiFixedConditions.年限 || aiFixedConditions.工作年限) {
    const yearStr = aiFixedConditions.年限 || aiFixedConditions.工作年限;
    const yearMatch = yearStr.match(/(\d+)[-\s]*(\d+)?/);
    if (yearMatch) {
      conditions.workYearLow = yearMatch[1];
      conditions.workYearHigh = yearMatch[2] || (parseInt(yearMatch[1]) + 2).toString();
    }
  }
  
  // 学历
  if (aiFixedConditions.学历 || aiFixedConditions.教育) {
    conditions.eduLevel = aiFixedConditions.学历 || aiFixedConditions.教育;
  }
  
  // 年龄
  if (aiFixedConditions.年龄) {
    const ageMatch = aiFixedConditions.年龄.match(/(\d+)[-\s]*(\d+)?/);
    if (ageMatch) {
      conditions.ageLow = ageMatch[1];
      conditions.ageHigh = ageMatch[2] || ageMatch[1];
    }
  }
  
  // 性别
  if (aiFixedConditions.性别) {
    conditions.sex = aiFixedConditions.性别 === '男' ? 1 : 2;
  }

  // 处理 AI 关键词
  if (aiKeywords) {
    // 职位（空格分隔）
    if (aiKeywords.职位?.length > 0) {
      conditions.jobTitle = aiKeywords.职位.join(' ');
    }

    // 公司（空格分隔）
    if (aiKeywords.公司?.length > 0) {
      conditions.company = aiKeywords.公司.join(' ');
    }

    // 学历（备用）
    if (aiKeywords.教育 || aiKeywords.学历) {
      conditions.eduLevel = aiKeywords.教育 || aiKeywords.学历;
    }

    // 构建布尔表达式关键词（技能、行业等）
    const keywordParts = [];

    if (aiKeywords.技能?.length > 0) {
      keywordParts.push(`(${aiKeywords.技能.join(' or ')})`);
    }

    if (aiKeywords.行业?.length > 0) {
      keywordParts.push(`(${aiKeywords.行业.join(' or ')})`);
    }

    if (aiKeywords.业务方向?.length > 0) {
      keywordParts.push(`(${aiKeywords.业务方向.join(' or ')})`);
    }

    if (aiKeywords.分析方向?.length > 0) {
      keywordParts.push(`(${aiKeywords.分析方向.join(' or ')})`);
    }

    if (keywordParts.length > 0) {
      conditions.keyword = keywordParts.join(' and ');
    }
  }

  return conditions;
}

export default {
  searchResumes,
  getResumeDetail,
  convertAiKeywordsToConditions,
};
