import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import SearchPanel from './components/SearchPanel/SearchPanel';
import AISearchHeader from './components/AISearchHeader/AISearchHeader';
import TalentList from './components/TalentList/TalentList';
import { Bell, Crown, Sparkles, Loader2 } from 'lucide-react';
import { searchResumes, convertAiKeywordsToConditions } from './services/liepinApi';

// 模拟人才数据生成器（作为 fallback）
function generateMockTalents(conditions, expanded) {
  const count = 3 + Math.floor(Math.random() * 3);
  const talents = [];

  const names = ['张伟', '李娜', '王强', '刘洋', '陈静', '杨帆', '赵敏', '黄杰', '周婷', '吴磊'];

  const companyPool = expanded?.公司?.length > 0 
    ? expanded.公司 
    : ['字节跳动', '阿里巴巴', '腾讯', '美团', '京东'];
  
  const positionPool = expanded?.职位?.length > 0
    ? expanded.职位
    : [conditions.position || '工程师'];

  const skillPool = expanded?.技能?.length > 0
    ? expanded.技能
    : ['Java', 'Spring'];

  for (let i = 0; i < count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const company = companyPool[Math.floor(Math.random() * companyPool.length)];
    const position = positionPool[Math.floor(Math.random() * positionPool.length)];
    const years = conditions.experience
      ? parseInt(conditions.experience) + Math.floor(Math.random() * 3)
      : 3 + Math.floor(Math.random() * 7);
    const age = 24 + years + Math.floor(Math.random() * 5);
    const isOnline = Math.random() > 0.6;

    const endYear = 2024;
    const startYear1 = endYear - Math.floor(Math.random() * 3);
    const startYear2 = startYear1 - years + Math.floor(Math.random() * 2);

    const personSkills = skillPool.slice(0, 2 + Math.floor(Math.random() * 3));

    talents.push({
      id: `mock-${Date.now()}-${i}`,
      name,
      gender: Math.random() > 0.5 ? 'male' : 'female',
      age,
      isOnline,
      status: isOnline ? '在职-看机会' : '离职-随时到岗',
      city: conditions.location || '北京',
      expectCity: conditions.location || '北京',
      experience: `${years}年`,
      education: conditions.education || '本科',
      expectPosition: position,
      salary: conditions.salary || `${20 + years}-${35 + years}K`,
      company,
      workExperience: [
        {
          company,
          position,
          period: `${startYear1}.06 - 至今`,
          duration: `${endYear - startYear1}年`,
        },
        {
          company: companyPool[Math.floor(Math.random() * companyPool.length)],
          position: position.replace('高级', ''),
          period: `${startYear2}.03 - ${startYear1}.06`,
          duration: `${startYear1 - startYear2}年`,
        },
      ],
      tags: [
        ...personSkills,
        '互联网大厂',
        years > 5 ? '资深经验' : '潜力股',
      ],
    });
  }

  return talents;
}

function App() {
  const [talents, setTalents] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const [searchConditions, setSearchConditions] = useState({});
  const [searchError, setSearchError] = useState(null);
  const [usingRealData, setUsingRealData] = useState(false);
  const [quickStartText, setQuickStartText] = useState('');
  const [quickFillText, setQuickFillText] = useState(''); // 用于选择职位回填但不自动发送

  // 快速开始 - 切换到 AI 模式并填入示例（自动发送）
  const handleQuickStart = useCallback((exampleText) => {
    setIsAiMode(true);
    if (exampleText) {
      setQuickStartText(exampleText);
    }
  }, []);

  // 选择职位 - 切换到 AI 模式并回填到输入框（不自动发送）
  const handleSelectPosition = useCallback((positionText) => {
    setIsAiMode(true);
    if (positionText) {
      setQuickFillText(positionText);
    }
  }, []);

  // 执行真实猎聘搜索
  const handleRealSearch = useCallback(async (aiKeywords, fixedConditions) => {
    setIsSearching(true);
    setSearchError(null);

    try {
      // 转换 AI 关键词为猎聘搜索条件
      const searchParams = convertAiKeywordsToConditions(aiKeywords, fixedConditions);
      
      console.log('猎聘搜索参数:', searchParams);
      
      // 调用真实 API
      const realTalents = await searchResumes(searchParams);
      
      if (realTalents && realTalents.length > 0) {
        setTalents(realTalents);
        setUsingRealData(true);
        console.log(`✅ 成功获取 ${realTalents.length} 份真实简历`);
      } else {
        // 真实 API 返回空，回退到 mock
        console.warn('⚠️ 真实 API 返回空，使用模拟数据');
        const mockTalents = generateMockTalents({}, aiKeywords);
        setTalents(mockTalents);
        setUsingRealData(false);
      }
    } catch (error) {
      console.error('❌ 真实 API 调用失败:', error);
      setSearchError(error.message);
      
      // 失败时回退到 mock 数据
      const mockTalents = generateMockTalents({}, aiKeywords);
      setTalents(mockTalents);
      setUsingRealData(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // 从搜索面板搜索（传统模式）
  const handlePanelSearch = useCallback(async () => {
    setIsSearching(true);
    setSearchError(null);

    // 构建条件
    const fixedConditions = {
      目前城市: searchConditions.目前城市,
      期望城市: searchConditions.期望城市,
      经验: searchConditions.经验,
      学历: searchConditions.学历,
    };

    const aiKeywords = {
      职位: searchConditions.职位 || [],
      公司: searchConditions.公司 || [],
      技能: searchConditions.技能 || [],
    };

    await handleRealSearch(aiKeywords, fixedConditions);
  }, [searchConditions, handleRealSearch]);

  // AI 搜索完成后的回调
  const handleAiSearchComplete = useCallback(async (talents, conditions, expanded) => {
    // AI 模式也使用真实 API
    if (expanded?.raw) {
      // 优先从 AI 返回的固定条件获取，其次从本地解析的 conditions 获取
      const aiFixed = expanded.raw.固定条件 || {};
      const fixedConditions = {
        目前城市: aiFixed.地点 || aiFixed.城市 || conditions.location,
        期望城市: aiFixed.期望地点 || aiFixed.期望城市 || conditions.expectCity,
        经验: aiFixed.年限 || aiFixed.工作年限 || conditions.experience,
        学历: aiFixed.学历 || conditions.education,
      };
      
      await handleRealSearch(expanded.raw, fixedConditions);
    } else {
      // 没有关键词时使用 mock
      setTalents(talents);
      setUsingRealData(false);
    }
  }, [handleRealSearch]);

  // 清空搜索
  const handleClearSearch = useCallback(() => {
    setTalents([]);
    setSearchConditions({});
    setSearchError(null);
    setUsingRealData(false);
    setIsSearching(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Sidebar />
      <main className="ml-[180px]">
        {/* 顶部导航 */}
        <header className="h-14 bg-white shadow-sm flex items-center px-6 sticky top-0 z-40">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">搜索人才</span>
            {usingRealData && talents.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                真实数据
              </span>
            )}
          </div>
          <div className="flex items-center gap-6 ml-auto">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">招聘数据</span>
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded text-white text-xs font-bold">
              <Crown size={12} />VIP
            </div>
            <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">我的权益</span>
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#a855f7] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">赵</span>
              </div>
              <span className="text-gray-700 text-sm">赵呈祥</span>
              <span className="text-gray-400 text-xs">▼</span>
            </div>
          </div>
        </header>

        {/* 主内容 */}
        <div className="p-5">
          {/* 搜索面板（猎聘风格） */}
          {isAiMode ? (
            <AISearchHeader
              onExecuteSearch={handleAiSearchComplete}
              onClearSearch={handleClearSearch}
              onToggleMode={() => setIsAiMode(false)}
              isSearching={isSearching}
              quickStartText={quickStartText}
              onQuickStartUsed={() => setQuickStartText('')}
              quickFillText={quickFillText}
              onQuickFillUsed={() => setQuickFillText('')}
            />
          ) : (
            <SearchPanel
              searchConditions={searchConditions}
              onUpdateConditions={setSearchConditions}
              onSearch={handlePanelSearch}
              isAiMode={isAiMode}
              onToggleAiMode={() => setIsAiMode(true)}
              isSearching={isSearching}
            />
          )}

          {/* 错误提示 */}
          {searchError && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <span className="text-sm text-amber-700">
                真实 API 暂时不可用，已切换为演示数据
              </span>
            </div>
          )}

          {/* 人才列表 */}
          <TalentList 
            talents={talents} 
            isSearching={isSearching} 
            hasSearched={talents.length > 0 || isSearching}
            onQuickStart={handleQuickStart}
            onSelectPosition={handleSelectPosition}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
