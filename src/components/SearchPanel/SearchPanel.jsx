import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  Settings2,
  Building2,
  Briefcase,
  Loader2,
  Save,
  Bell
} from 'lucide-react';

// 筛选配置
const FILTER_ROWS = [
  {
    key: '职位',
    title: '职位',
    icon: Briefcase,
    placeholder: '搜索职位关键词',
    quickTags: ['销售运营', '运营', '数据分析', '算法', '产品', '开发'],
  },
  {
    key: '公司',
    title: '公司',
    icon: Building2,
    placeholder: '搜索公司',
    quickTags: [],
  },
];

const FIXED_FILTERS = {
  目前城市: ['不限', '北京', '苏州', '大连', '上海', '甘肃', '其他'],
  期望城市: ['不限', '北京', '武汉', '苏州', '广州', '昌都', '其他'],
  经验: ['不限', '在校/应届', '1-3年', '3-5年', '5-10年', '自定义'],
  学历: ['不限', '大专', '本科', '硕士', '博士/博士后', '中专/中技'],
};

const OTHER_FILTERS = [
  { key: '活跃状态', options: ['不限', '活跃', '沉默'] },
  { key: '求职状态', options: ['不限', '在职看机会', '离职-随时到岗'] },
  { key: '跳槽频率', options: [] },
  { key: '年龄', options: ['不限', '30-35岁', '35-40岁'] },
  { key: '性别', options: [] },
  { key: '语言', options: [] },
  { key: '毕业年份', options: [] },
  { key: '当前行业', options: [] },
  { key: '期望行业', options: [] },
  { key: '当前职能', options: [] },
  { key: '期望职能', options: [] },
];

// 模拟快捷搜索历史
const QUICK_SEARCH_HISTORY = [
  { name: '运营_数据分析', count: 24, isNew: true },
  { name: 'Java_北京_3年', count: 156, isNew: false },
  { name: '产品_美团背景', count: 89, isNew: false },
];

const SearchPanel = ({ 
  searchConditions = {}, 
  onUpdateConditions, 
  onSearch,
  isAiMode = false,
  onToggleAiMode,
  isSearching = false
}) => {
  const [showMore, setShowMore] = useState(false);
  const [showFullSettings, setShowFullSettings] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [compositeInput, setCompositeInput] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  // 获取某维度的关键词
  const getKeywords = (key) => searchConditions[key] || [];

  // 添加关键词
  const handleAddKeyword = (key, value) => {
    if (!value.trim()) return;
    const current = getKeywords(key);
    if (!current.includes(value.trim())) {
      onUpdateConditions({
        ...searchConditions,
        [key]: [...current, value.trim()],
      });
    }
    setInputValues({ ...inputValues, [key]: '' });
  };

  // 删除关键词
  const handleRemoveKeyword = (key, value) => {
    const current = getKeywords(key);
    onUpdateConditions({
      ...searchConditions,
      [key]: current.filter((k) => k !== value),
    });
  };

  // 清空某维度
  const handleClearDimension = (key) => {
    const newConditions = { ...searchConditions };
    delete newConditions[key];
    onUpdateConditions(newConditions);
  };

  // 清空全部
  const handleClearAll = () => {
    onUpdateConditions({});
    setCompositeInput('');
  };

  // 处理复合关键词搜索
  const handleCompositeSearch = () => {
    if (compositeInput.trim()) {
      // 解析复合输入并添加到对应维度
      const words = compositeInput.trim().split(/[\s,，]+/);
      const newConditions = { ...searchConditions };
      
      words.forEach(word => {
        if (!newConditions.复合关键词) {
          newConditions.复合关键词 = [];
        }
        if (!newConditions.复合关键词.includes(word)) {
          newConditions.复合关键词.push(word);
        }
      });
      
      onUpdateConditions(newConditions);
    }
    onSearch();
  };

  // 渲染筛选行
  const renderFilterRow = (config) => {
    const keywords = getKeywords(config.key);
    const Icon = config.icon;
    const inputValue = inputValues[config.key] || '';

    return (
      <div 
        key={config.key} 
        className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-colors"
      >
        {/* 标签 */}
        <div className="flex items-center gap-1.5 w-16 pt-1.5 flex-shrink-0">
          <Icon size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600 font-medium">{config.title}</span>
        </div>

        {/* 内容区 */}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            {/* 已选关键词 */}
            {keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#f5f3ff] text-[#7c3aed] text-sm rounded-md border border-[#ddd6fe] animate-in fade-in duration-200"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(config.key, keyword)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            {/* 添加按钮 */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === config.key ? null : config.key)}
                className="flex items-center gap-1 px-2 py-1 text-sm text-[#7c3aed] border border-dashed border-[#7c3aed] rounded-md hover:bg-[#f5f3ff] transition-all hover:shadow-sm"
              >
                <Plus size={14} />
                添加{config.title}
              </button>

              {/* 添加下拉 */}
              {activeDropdown === config.key && (
                <div 
                  className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-2 animate-in fade-in slide-in-from-top-1 duration-200"
                >
                  <div className="flex items-center gap-1 mb-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValues({ ...inputValues, [config.key]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyword(config.key, inputValue);
                        }
                      }}
                      placeholder={config.placeholder}
                      className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded outline-none focus:border-[#7c3aed]"
                      autoFocus
                    />
                    <button
                      onClick={() => handleAddKeyword(config.key, inputValue)}
                      className="px-2 py-1 text-xs bg-[#7c3aed] text-white rounded hover:bg-[#6d28d9]"
                    >
                      添加
                    </button>
                  </div>
                  {config.quickTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {config.quickTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleAddKeyword(config.key, tag)}
                          className="px-2 py-0.5 text-xs text-gray-600 bg-gray-50 rounded hover:bg-[#f5f3ff] hover:text-[#7c3aed] transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染固定筛选项 - 优化样式
  const renderFixedFilter = (title, options) => {
    const selected = searchConditions[title] || '不限';

    return (
      <div 
        key={title} 
        className="flex items-start gap-3 py-2.5 border-b border-gray-100 hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-colors"
      >
        <div className="w-16 pt-1 flex-shrink-0">
          <span className="text-sm text-gray-600 font-medium">{title}</span>
        </div>
        <div className="flex-1 flex items-center gap-1.5 flex-wrap">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                if (opt === '不限') {
                  const newConditions = { ...searchConditions };
                  delete newConditions[title];
                  onUpdateConditions(newConditions);
                } else {
                  onUpdateConditions({ ...searchConditions, [title]: opt });
                }
              }}
              className={`px-2.5 py-1 text-sm rounded-md transition-all ${
                selected === opt
                  ? 'bg-[#7c3aed] text-white font-medium shadow-sm'
                  : 'text-gray-600 hover:text-[#7c3aed] hover:bg-gray-100'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // 生成已选条件摘要
  const getSelectedSummary = () => {
    const parts = [];
    if (searchConditions.职位?.length) parts.push(...searchConditions.职位.slice(0, 2));
    if (searchConditions.目前城市 && searchConditions.目前城市 !== '不限') parts.push(searchConditions.目前城市);
    if (searchConditions.经验 && searchConditions.经验 !== '不限') parts.push(searchConditions.经验);
    if (searchConditions.学历 && searchConditions.学历 !== '不限') parts.push(searchConditions.学历);
    return parts;
  };

  const selectedSummary = getSelectedSummary();
  const hasConditions = Object.keys(searchConditions).length > 0;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4 transition-all ${isSearching ? 'opacity-70' : ''}`}>
      {/* 搜索中遮罩 */}
      {isSearching && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-[#7c3aed]" />
            <span className="text-sm text-gray-600">搜索中...</span>
          </div>
        </div>
      )}

      {/* 头部 - 标题兼模式切换入口 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <button
          onClick={onToggleAiMode}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#7c3aed] hover:text-[#7c3aed] transition-colors group"
        >
          <Search size={16} className="text-gray-400 group-hover:text-[#7c3aed]" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-[#7c3aed]">传统搜索</span>
          <span className="text-xs text-gray-400 border-l border-gray-200 pl-2 ml-1">
            点击切换 AI 帮搜
          </span>
        </button>
        <div className="text-xs text-gray-400">
          多维度精准筛选
        </div>
      </div>

      {/* 顶部搜索栏 - 优化布局 */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        {/* 复合关键词输入框 */}
        <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-200 focus-within:border-[#7c3aed] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#7c3aed]/10 transition-all">
          <span className="text-xs text-gray-400 border-r border-gray-300 pr-2 whitespace-nowrap">复合关键词</span>
          <input
            type="text"
            value={compositeInput}
            onChange={(e) => setCompositeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCompositeSearch();
              }
            }}
            placeholder="输入职位、公司、技能等关键词"
            className="flex-1 bg-transparent text-sm outline-none"
            disabled={isSearching}
          />
          {hasConditions && (
            <button 
              onClick={handleClearAll}
              className="text-gray-400 hover:text-gray-600 p-0.5 hover:bg-gray-200 rounded transition-colors"
              disabled={isSearching}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 搜索按钮 */}
        <button
          onClick={handleCompositeSearch}
          disabled={isSearching}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#5b4ddb] text-white text-sm font-medium rounded-lg hover:bg-[#4a3fc7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] justify-center"
        >
          {isSearching ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>搜索中</span>
            </>
          ) : (
            <>
              <Search size={16} />
              <span>搜索</span>
            </>
          )}
        </button>

        {/* 设置按钮 - 替代原来的AI帮搜按钮 */}
        <button
          onClick={() => setShowFullSettings(!showFullSettings)}
          className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
            showFullSettings
              ? 'bg-[#f5f3ff] border-[#7c3aed] text-[#7c3aed]'
              : 'bg-white border-gray-200 text-gray-600 hover:border-[#7c3aed] hover:text-[#7c3aed]'
          }`}
          disabled={isSearching}
        >
          <Settings2 size={16} />
          <span>设置</span>
        </button>
      </div>

      {/* 已选条件摘要 - 猎聘风格 */}
      {hasConditions && (
        <div className="px-4 py-2 bg-[#fafafa] border-b border-gray-100 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">已选：</span>
          {selectedSummary.length > 0 ? (
            <span className="text-sm text-gray-700">
              {selectedSummary.join(' · ')}
            </span>
          ) : (
            <span className="text-sm text-gray-400">暂无条件</span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-1 text-xs text-[#7c3aed] hover:text-[#6d28d9] px-2 py-1 rounded hover:bg-[#f5f3ff] transition-colors">
              <Save size={12} />
              保存搜索条件
            </button>
            <button className="flex items-center gap-1 text-xs text-[#7c3aed] hover:text-[#6d28d9] px-2 py-1 rounded hover:bg-[#f5f3ff] transition-colors">
              <Bell size={12} />
              订阅
            </button>
          </div>
        </div>
      )}

      {/* 快捷搜索 - 动态数据 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <span className="text-sm text-gray-600 font-medium w-16">快捷搜索</span>
        <div className="flex items-center gap-2 flex-wrap">
          {QUICK_SEARCH_HISTORY.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                // 解析快捷搜索并应用
                const parts = item.name.split('_');
                const newConditions = { ...searchConditions };
                if (!newConditions.复合关键词) newConditions.复合关键词 = [];
                parts.forEach(part => {
                  if (!newConditions.复合关键词.includes(part)) {
                    newConditions.复合关键词.push(part);
                  }
                });
                onUpdateConditions(newConditions);
              }}
              className="flex items-center gap-1.5 px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded border border-gray-200 hover:border-[#7c3aed] hover:text-[#7c3aed] transition-colors group"
            >
              <span>{item.name}</span>
              {item.isNew && (
                <span className="px-1 py-0 bg-[#7c3aed] text-white rounded text-[10px]">新增</span>
              )}
              <span className="text-gray-400 group-hover:text-[#7c3aed]">{item.count}</span>
            </button>
          ))}
          <button className="text-xs text-gray-400 hover:text-[#7c3aed] flex items-center gap-0.5">
            更多 <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* 筛选条件区域 */}
      <div className="px-4">
        {/* 职位、公司行 */}
        {FILTER_ROWS.map(renderFilterRow)}

        {/* 固定筛选条件 */}
        {Object.entries(FIXED_FILTERS).map(([title, options]) => renderFixedFilter(title, options))}

        {/* 其他筛选（可展开） */}
        {showMore && (
          <div className="py-2 animate-in slide-in-from-top-2 duration-200">
            {OTHER_FILTERS.map((filter) => (
              <div key={filter.key} className="flex items-center gap-3 py-2 border-b border-gray-100 hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-colors">
                <div className="w-16 flex-shrink-0">
                  <span className="text-sm text-gray-600">{filter.key}</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  {filter.options.length > 0 ? (
                    filter.options.map((opt) => (
                      <button
                        key={opt}
                        className="text-sm text-gray-600 hover:text-[#7c3aed] px-2 py-0.5 rounded hover:bg-gray-100 transition-colors"
                      >
                        {opt}
                      </button>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">点击展开设置</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 展开更多条件 */}
        <div className="flex items-center justify-end py-3">
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-1 text-sm text-[#7c3aed] hover:text-[#6d28d9] transition-colors"
          >
            {showMore ? '收起条件' : '展开更多条件'}
            {showMore ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
      </div>

      {/* 详细条件标签展示 */}
      {hasConditions && (
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100 flex-wrap">
          {Object.entries(searchConditions).map(([key, value]) => {
            if (Array.isArray(value)) {
              return value.map((v, idx) => (
                <span
                  key={`${key}-${idx}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-sm text-gray-700 rounded border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all"
                >
                  <span className="text-gray-400 text-xs">{key}:</span>
                  {v}
                  <button
                    onClick={() => handleRemoveKeyword(key, v)}
                    className="text-gray-400 hover:text-red-500 p-0.5 hover:bg-red-50 rounded transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ));
            } else if (value !== '不限' && value) {
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-sm text-gray-700 rounded border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all"
                >
                  <span className="text-gray-400 text-xs">{key}:</span>
                  {value}
                  <button
                    onClick={() => handleClearDimension(key)}
                    className="text-gray-400 hover:text-red-500 p-0.5 hover:bg-red-50 rounded transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            }
            return null;
          })}
          <button
            onClick={handleClearAll}
            className="text-sm text-gray-500 hover:text-red-500 ml-2 px-2 py-1 hover:bg-red-50 rounded transition-colors"
          >
            清除全部
          </button>
        </div>
      )}

      {/* 完整设置面板（展开） */}
      {showFullSettings && (
        <div className="border-t border-gray-200 bg-gray-50/50 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">完整搜索设置</span>
            <button 
              onClick={() => setShowFullSettings(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          <div className="text-sm text-gray-500">
            这里可以放置更复杂的设置选项，如薪资范围滑块、更多筛选维度等。
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
