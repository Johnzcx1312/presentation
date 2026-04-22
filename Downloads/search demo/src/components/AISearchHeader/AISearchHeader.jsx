import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Mic,
  RotateCcw,
  Search,
  Send,
  Settings2,
  Sparkles,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { kimiAgentChat, expandKeywords } from '../../services/kimiApi';
import FullSearchPanel from '../FullSearchPanel/FullSearchPanel';

// 本地解析搜索条件（快速响应）
function parseConditions(query) {
  const conditions = {
    position: null,
    experience: null,
    education: null,
    location: null,
    salary: null,
    skills: [],
  };

  const posMatch = query.match(
    /(Java|Python|前端|后端|全栈|算法|AI|产品|运营|设计|测试|运维|架构师|总监|经理|工程师|专员)[工程师|开发|师|经理|专员|主管]*/i
  );
  if (posMatch) conditions.position = posMatch[0];

  const expMatch = query.match(/(\d+)[-\s]*(?:年|年以上|年经验|年工作)/);
  if (expMatch) {
    const years = parseInt(expMatch[1], 10);
    if (!Number.isNaN(years)) {
      conditions.experience = years >= 5 ? '5-10年' : years >= 3 ? '3-5年' : '1-3年';
    }
  }

  const cities = ['北京', '上海', '深圳', '广州', '杭州', '成都', '武汉', '西安'];
  for (const city of cities) {
    if (query.includes(city)) {
      conditions.location = city;
      break;
    }
  }

  const salaryMatch = query.match(/(\d+)[-\s]*(\d+)?\s*[kK]/);
  if (salaryMatch) {
    const min = salaryMatch[1];
    const max = salaryMatch[2] || String(parseInt(min, 10) + 10);
    conditions.salary = `${min}-${max}K`;
  }

  const eduMatch = query.match(/(本科|硕士|博士|专科|大专)及以上学历?/);
  if (eduMatch) conditions.education = eduMatch[1];

  const skillKeywords = ['微服务', '分布式', 'Spring', 'Redis', 'Kafka', 'MySQL', 'React', 'Vue', '高并发'];
  for (const s of skillKeywords) {
    if (query.toLowerCase().includes(s.toLowerCase())) {
      conditions.skills.push(s);
    }
  }

  return conditions;
}

// 生成模拟人才数据
function generateMockTalents(conditions, expanded) {
  const count = 3 + Math.floor(Math.random() * 3); // 3-5条
  const talents = [];

  const names = ['张伟', '李娜', '王强', '刘洋', '陈静', '杨帆', '赵敏', '黄杰', '周婷', '吴磊'];

  // 从扩展结果中获取公司列表
  let companyPool = expanded?.expanded?.companies || ['字节跳动', '阿里巴巴', '腾讯', '美团', '京东'];
  if (companyPool.length === 0) {
    companyPool = ['字节跳动', '阿里巴巴', '腾讯', '美团', '京东', '百度', '快手', '拼多多', '小红书'];
  }

  // 从扩展结果中获取技能列表
  let skillPool = expanded?.expanded?.skills || conditions.skills || ['Java', 'Spring'];

  // 从扩展结果中获取职位列表
  const positionPool = expanded?.expanded?.positions || [conditions.position || '工程师'];

  for (let i = 0; i < count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const company = companyPool[Math.floor(Math.random() * companyPool.length)];
    const position = positionPool[Math.floor(Math.random() * positionPool.length)];
    const years = conditions.experience
      ? parseInt(conditions.experience) + Math.floor(Math.random() * 3)
      : 3 + Math.floor(Math.random() * 7);
    const age = 24 + years + Math.floor(Math.random() * 5);
    const isOnline = Math.random() > 0.6;

    // 计算工作时间段
    const endYear = 2024;
    const startYear1 = endYear - Math.floor(Math.random() * 3);
    const startYear2 = startYear1 - years + Math.floor(Math.random() * 2);

    // 为每个人生成技能标签
    const personSkills = [];
    const skillCount = 2 + Math.floor(Math.random() * 3);
    for (let s = 0; s < skillCount && s < skillPool.length; s++) {
      personSkills.push(skillPool[s]);
    }
    if (personSkills.length === 0) {
      personSkills.push('专业技能');
    }

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
          position: position.replace('高级', '').replace('资深', ''),
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

const AISearchHeader = ({ 
  onExecuteSearch, 
  onClearSearch, 
  onToggleMode, 
  isSearching: parentIsSearching,
  quickStartText,
  onQuickStartUsed,
  quickFillText,
  onQuickFillUsed
}) => {
  // 对话状态
  const [currentRound, setCurrentRound] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [inputText, setInputText] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [aiError, setAiError] = useState('');
  const [expandedResult, setExpandedResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // 搜索条件状态
  const [searchConditions, setSearchConditions] = useState({});
  const [showFullPanel, setShowFullPanel] = useState(false);
  const [conditionsUpdated, setConditionsUpdated] = useState(false);

  // UI 状态
  const [selectedPosition, setSelectedPosition] = useState('');
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const inputRef = useRef(null);
  const isProcessingRef = useRef(false);

  const publishedPositions = useMemo(
    () => [
      { id: 1, title: '高级Java工程师', department: '技术部', location: '北京' },
      { id: 2, title: '产品经理', department: '产品部', location: '上海' },
      { id: 3, title: '运营专员', department: '运营部', location: '北京' },
      { id: 4, title: 'UI设计师', department: '设计部', location: '深圳' },
      { id: 5, title: '数据分析师', department: '数据部', location: '北京' },
    ],
    []
  );

  const searchHistory = useMemo(
    () => [
      '3-5年经验的Java开发，会微服务',
      '本科以上学历，有互联网大厂背景的产品经理',
      '北京地区的运营，薪资20-30K',
      '5年以上经验的技术总监，管理过团队',
    ],
    []
  );

  // 发送消息
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isProcessingRef.current) return;

    isProcessingRef.current = true;
    setAiError('');
    setHasSearched(true);

    // 立即清空之前的搜索结果（搜索前列表空）
    if (onExecuteSearch) {
      onExecuteSearch([]);
    }

    // 如果有当前轮，移到历史
    if (currentRound) {
      setHistory((prev) => [...prev, currentRound]);
    }

    // 设置新的当前轮（用户消息）
    setCurrentRound({ user: text, ai: null, type: null });
    setInputText('');
    setIsAiTyping(true);
    setExpandedResult(null);

    // 本地快速解析条件（固定字段）
    const conditions = parseConditions(text);

    // 调用 Agent 进行关键词扩展
    try {
      const response = await kimiAgentChat({
        userText: text,
        history: history.map((h) => ({
          user: h.user,
          ai: h.ai,
          quote: h.expanded?.raw,
        })),
        previousExpanded: expandedResult,
      });

      // 使用 Agent 返回的关键词或本地扩展
      const expanded = expandKeywords(conditions, response);
      setExpandedResult(expanded);

      // 生成AI回复消息
      let aiMsg = response.msg;
      if (!aiMsg && response.keywords) {
        const dimCount = Object.keys(response.keywords).length;
        const totalCount = Object.values(response.keywords).reduce((sum, arr) => sum + (arr?.length || 0), 0);
        aiMsg = `已为您拆解${dimCount}个维度、${totalCount}个关键词。点击查看详情或继续对话补充。`;
      }

      // 更新当前轮
      setCurrentRound({
        user: text,
        ai: aiMsg || '已为您拆解关键词并搜索',
        type: response.task || '关键词扩展',
        shouldExpand: response.shouldExpand,
        expanded: expanded,
      });

      // 更新搜索条件（用于 FullSearchPanel）
      if (expanded?.raw) {
        // 将固定条件也合并到 searchConditions 中
        const fixed = expanded.fixedConditions || expanded.raw.固定条件 || {};
        setSearchConditions({
          ...expanded.raw,
          目前城市: fixed.地点 || fixed.城市,
          期望城市: fixed.期望地点 || fixed.期望城市,
          经验: fixed.年限 || fixed.工作年限,
          学历: fixed.学历 || fixed.教育,
        });
        setConditionsUpdated(true);
      }

      // 生成模拟人才数据并搜索
      const mockTalents = generateMockTalents(conditions, expanded);
      if (onExecuteSearch) {
        onExecuteSearch(mockTalents, conditions, expanded);
      }
    } catch (e) {
      // 降级处理
      const fallbackMsg = conditions.position
        ? '方向如果要再具体些，也可以告诉我，我再帮你扩一轮。'
        : '想扩的是哪类岗位？告诉我，我来拆关键词。';

      const expanded = conditions.position ? expandKeywords(conditions, null) : null;
      setExpandedResult(expanded);

      setCurrentRound({
        user: text,
        ai: fallbackMsg,
        type: conditions.position ? '关键词扩展并追问' : '普通对话',
        shouldExpand: !!conditions.position,
        expanded,
      });

      const mockTalents = generateMockTalents(conditions, expanded);
      if (onExecuteSearch) {
        onExecuteSearch(mockTalents, conditions, expanded);
      }
    } finally {
      setIsAiTyping(false);
      isProcessingRef.current = false;
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // 处理快速开始文本 - 自动填入并发送
  // 处理快速开始文本 - 自动填入并发送
  useEffect(() => {
    if (quickStartText && !isProcessingRef.current) {
      setInputText(quickStartText);
      // 延迟一下确保状态更新后再发送
      setTimeout(() => {
        handleSend();
        onQuickStartUsed?.();
      }, 100);
    }
  }, [quickStartText]);

  // 处理职位选择回填 - 只填入输入框，不自动发送
  useEffect(() => {
    if (quickFillText && !isProcessingRef.current) {
      setInputText(quickFillText);
      onQuickFillUsed?.();
      // 聚焦输入框方便用户继续编辑
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [quickFillText]);

  // 快捷键
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 选择预设职位
  const handlePositionSelect = (pos) => {
    setSelectedPosition(pos);
    setShowPositionDropdown(false);
    const prompt = `帮我找一位${pos.title}，base在${pos.location}`;
    setInputText(prompt);
    inputRef.current?.focus();
  };

  // 语音输入
  const handleVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const addition = '，要求有微服务和分布式经验';
      setInputText((prev) => prev + addition);
      inputRef.current?.focus();
    }, 1500);
  };

  // 快捷标签
  const handleQuickTag = (tag) => {
    setInputText((prev) => (prev ? `${prev}，${tag}` : tag));
    inputRef.current?.focus();
  };

  // 清空
  const handleClear = () => {
    setCurrentRound(null);
    setHistory([]);
    setExpandedResult(null);
    setAiError('');
    setInputText('');
    setHasSearched(false);
    setSearchConditions({});
    setConditionsUpdated(false);
    setShowFullPanel(false);
    if (onClearSearch) {
      onClearSearch();
    }
  };

  // 切换完整搜索面板
  const handleToggleFullPanel = () => {
    setShowFullPanel((prev) => !prev);
    if (!showFullPanel) {
      setConditionsUpdated(false);
    }
  };

  // 手动更新搜索条件
  const handleManualUpdateConditions = (newConditions) => {
    setSearchConditions(newConditions);
  };

  // 从搜索面板执行搜索
  const handlePanelSearch = () => {
    // 可以基于当前条件重新生成搜索结果
    if (onExecuteSearch && currentRound) {
      const conditions = parseConditions(currentRound.user);
      const mockTalents = generateMockTalents(conditions, { expanded: searchConditions, raw: searchConditions });
      onExecuteSearch(mockTalents, conditions, { expanded: searchConditions, raw: searchConditions });
    }
  };

  // 重新搜索（基于当前条件扩词）
  const handleReSearch = () => {
    if (currentRound?.user) {
      setInputText('再扩一些类似的');
      setTimeout(() => handleSend(), 100);
    }
  };

  // 从历史选择
  const handleSelectHistory = (item) => {
    setInputText(item);
    setShowHistoryDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
      {/* 头部 - 标题兼模式切换入口 */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onToggleMode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f5f3ff] border border-[#ddd6fe] hover:bg-[#ede9fe] transition-colors group"
        >
          <Sparkles size={16} className="text-[#7c3aed] group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-[#7c3aed]">AI 智能招聘助手</span>
          {(currentRound || history.length > 0) && (
            <span className="text-xs text-[#7c3aed]/60">({history.length + (currentRound ? 1 : 0)} 轮)</span>
          )}
          <span className="text-xs text-gray-400 ml-1 border-l border-[#ddd6fe] pl-2">
            点击切换传统搜索
          </span>
        </button>
        <div className="flex items-center gap-2">
          {(currentRound || history.length > 0) && (
            <>
              {currentRound?.shouldExpand && (
                <button
                  onClick={handleReSearch}
                  className="text-xs text-[#7c3aed] hover:text-[#6d28d9] flex items-center gap-1 px-2 py-1 rounded hover:bg-[#f5f3ff] transition-colors"
                >
                  <RotateCcw size={12} />
                  再扩一轮
                </button>
              )}
              <button
                onClick={handleClear}
                className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                <X size={12} />
                清空
              </button>
            </>
          )}
        </div>
      </div>

      {/* 对话+输入融合区域 */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* 当前轮对话展示 */}
        {(currentRound || isAiTyping) && (
          <div className="bg-[#faf9ff] px-4 py-3 space-y-3">
            {/* 用户消息 */}
            {currentRound?.user && (
              <div className="flex items-start gap-2 animate-in slide-in-from-right-2 duration-300">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <User size={12} className="text-white" />
                </div>
                <div className="flex-1 bg-[#7c3aed] text-white text-sm px-3 py-2.5 rounded-2xl rounded-tl-sm shadow-sm">
                  {currentRound.user}
                </div>
              </div>
            )}

            {/* AI 回复 */}
            <div className="flex items-start gap-2 animate-in slide-in-from-left-2 duration-300">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a855f7] flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot size={12} className="text-white" />
              </div>
              <div className="flex-1">
                {isAiTyping ? (
                  <div className="bg-white border border-gray-200 text-sm px-4 py-3 rounded-2xl rounded-tl-sm inline-flex items-center gap-3 shadow-sm">
                    <span className="text-gray-500 text-xs">AI 思考中</span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#7c3aed] rounded-full animate-[bounce_1s_infinite]" />
                      <span className="w-2 h-2 bg-[#7c3aed] rounded-full animate-[bounce_1s_infinite_0.2s]" />
                      <span className="w-2 h-2 bg-[#7c3aed] rounded-full animate-[bounce_1s_infinite_0.4s]" />
                    </div>
                  </div>
                ) : currentRound?.ai ? (
                  <div className="bg-white border border-gray-200 text-gray-700 text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm shadow-sm leading-relaxed">
                    {currentRound.ai}
                  </div>
                ) : null}
              </div>
            </div>

            {/* 搜索执行状态 */}
            {parentIsSearching && (
              <div className="flex items-start gap-2 animate-in fade-in duration-500">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a855f7] flex items-center justify-center flex-shrink-0">
                  <Bot size={12} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-[#f5f3ff] border border-[#ddd6fe] text-sm px-4 py-2.5 rounded-2xl rounded-tl-sm inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[#7c3aed]">正在为您搜索匹配的人才...</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* 完整搜索面板（展开时显示在对话卡片内） */}
        {showFullPanel && (
          <FullSearchPanel
            isOpen={showFullPanel}
            conditions={searchConditions}
            fixedConditions={expandedResult?.fixedConditions || expandedResult?.raw?.固定条件}
            onUpdateConditions={handleManualUpdateConditions}
            onClose={handleToggleFullPanel}
            onSearch={handlePanelSearch}
          />
        )}

        {/* 输入框区域 */}
        <div className="relative p-3 bg-white">
          {/* 职位选择 */}
          <div className="absolute left-3 top-3 z-10">
            <div className="relative">
              <button
                onClick={() => setShowPositionDropdown(!showPositionDropdown)}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-[#7c3aed] hover:text-[#7c3aed] transition-colors"
              >
                <span className="truncate max-w-[80px]">
                  {selectedPosition ? selectedPosition.title : '选择职位'}
                </span>
                <ChevronDown size={12} className={`transition-transform ${showPositionDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showPositionDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500">已发布的职位</span>
                  </div>
                  {publishedPositions.map((pos) => (
                    <div
                      key={pos.id}
                      onClick={() => handlePositionSelect(pos)}
                      className="px-3 py-2 cursor-pointer hover:bg-[#f5f3ff] border-b border-gray-50 last:border-0"
                    >
                      <div className="text-sm font-medium text-gray-900">{pos.title}</div>
                      <div className="text-xs text-gray-500">{pos.department} · {pos.location}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 输入框 */}
          <div className="pl-28 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentRound
                  ? '继续补充需求，按 Enter 发送...'
                  : '描述招聘需求，例如：帮我找3-5年Java工程师，base北京...'
              }
              className="flex-1 bg-transparent text-sm text-gray-700 resize-none outline-none min-h-[36px] max-h-[80px] py-1"
              rows={1}
              disabled={isAiTyping}
            />

            <div className="flex items-center gap-1">
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                  disabled={isAiTyping}
                >
                  <XCircle size={16} />
                </button>
              )}
              <button
                onClick={handleVoiceInput}
                className={`p-1.5 rounded ${isListening ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:bg-gray-100'}`}
                disabled={isAiTyping}
              >
                <Mic size={16} />
              </button>
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isAiTyping}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#7c3aed] text-white text-xs font-medium rounded-lg hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={14} />
                发送
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 底部工具栏：快捷标签 + 设置搜索条件 + 历史 */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {/* 设置搜索条件按钮（主要入口） */}
          <button
            onClick={handleToggleFullPanel}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
              showFullPanel
                ? 'bg-[#f5f3ff] border-[#7c3aed] text-[#7c3aed]'
                : conditionsUpdated
                  ? 'bg-[#f5f3ff] border-[#7c3aed] text-[#7c3aed] animate-pulse'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-[#7c3aed] hover:text-[#7c3aed]'
            }`}
          >
            <Settings2 size={14} />
            {showFullPanel ? '收起搜索条件' : conditionsUpdated ? 'AI 已更新条件' : '设置搜索条件'}
            {Object.keys(searchConditions).length > 0 && !showFullPanel && (
              <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px]">
                {Object.keys(searchConditions).length}
              </span>
            )}
          </button>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          {/* 快捷标签 */}
          {['3年经验', '本科以上', '25-35K', '北京地区', '大厂背景', '微服务'].map((tag) => (
            <button
              key={tag}
              onClick={() => handleQuickTag(tag)}
              disabled={isAiTyping}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-[#f5f3ff] hover:text-[#7c3aed] disabled:opacity-50 transition-colors"
            >
              + {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* 历史对话展开按钮 */}
          {history.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-gray-500 hover:text-[#7c3aed] flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              {showHistory ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              历史对话 ({history.length}轮)
            </button>
          )}

          {/* 历史搜索下拉 */}
          <div className="relative">
            <button
              onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
              className="text-xs text-gray-500 hover:text-[#7c3aed] flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              <span>历史搜索</span>
              <ChevronDown size={12} />
            </button>

            {showHistoryDropdown && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-500">历史搜索</span>
                </div>
                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectHistory(item)}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 历史对话展开区域 */}
      {showHistory && history.length > 0 && (
        <div className="mt-3 bg-gray-50 rounded-xl p-3 space-y-3 max-h-48 overflow-y-auto">
          <div className="text-xs text-gray-400 mb-2">历史对话</div>
          {history.map((round, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center flex-shrink-0">
                  <User size={10} className="text-white" />
                </div>
                <div className="flex-1 bg-white text-gray-700 text-xs px-2 py-1.5 rounded-lg border border-gray-200">
                  {round.user}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a855f7] flex items-center justify-center flex-shrink-0">
                  <Bot size={10} className="text-white" />
                </div>
                <div className="flex-1 bg-white text-gray-600 text-xs px-2 py-1.5 rounded-lg border border-gray-200">
                  {round.ai}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 错误提示 */}
      {aiError && (
        <div className="mt-3 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
          ⚠️ {aiError}
        </div>
      )}
    </div>
  );
};

export default AISearchHeader;
