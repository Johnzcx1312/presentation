import React, { useState, useEffect } from 'react';
import { X, Plus, ChevronDown, Search, Sparkles } from 'lucide-react';

// 筛选维度配置
const FILTER_DIMENSIONS = [
  {
    key: '职位',
    title: '职位',
    icon: '💼',
    placeholder: '输入职位关键词',
    quickTags: ['Java开发', '产品经理', '运营', '数据分析', '销售', 'HR', '财务', '测试'],
    color: 'purple',
  },
  {
    key: '公司',
    title: '公司',
    icon: '🏢',
    placeholder: '输入公司名',
    quickTags: ['字节跳动', '阿里巴巴', '腾讯', '美团', '京东', '百度', '快手', '拼多多'],
    color: 'green',
  },
  {
    key: '技能',
    title: '技能',
    icon: '⚡',
    placeholder: '输入技能关键词',
    quickTags: ['Java', 'Python', 'React', 'Vue', '数据分析', 'SQL', 'Excel', 'PPT'],
    color: 'blue',
  },
  {
    key: '行业',
    title: '行业',
    icon: '📊',
    placeholder: '输入行业',
    quickTags: ['互联网', '金融', '电商', '教育', '医疗', '制造业', '房地产', '汽车'],
    color: 'orange',
  },
  {
    key: '业务方向',
    title: '业务方向',
    icon: '🎯',
    placeholder: '输入业务方向',
    quickTags: ['ToB', 'ToC', '电商', '社交', 'SaaS', 'AI', '大数据', '云计算'],
    color: 'cyan',
  },
];

// 固定筛选项
const FIXED_FILTERS = {
  目前城市: ['不限', '北京', '上海', '深圳', '杭州', '广州', '成都', '武汉', '西安', '其他'],
  期望城市: ['不限', '北京', '上海', '深圳', '杭州', '广州', '成都', '武汉', '西安', '其他'],
  经验年限: ['不限', '在校/应届', '1-3年', '3-5年', '5-10年', '10年以上'],
  学历: ['不限', '大专', '本科', '硕士', '博士'],
};

const COLOR_MAP = {
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', hover: 'hover:border-purple-300' },
  green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', hover: 'hover:border-green-300' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:border-blue-300' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:border-orange-300' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', hover: 'hover:border-cyan-300' },
};

const FullSearchPanel = ({ isOpen, conditions = {}, fixedConditions = {}, onUpdateConditions, onClose, onSearch }) => {
  const [activeTab, setActiveTab] = useState('职位');
  const [inputValue, setInputValue] = useState('');
  const [selectedFixed, setSelectedFixed] = useState({
    目前城市: '不限',
    期望城市: '不限',
    经验年限: '不限',
    学历: '不限',
  });

  // 从外部固定条件同步（当面板打开时）
  useEffect(() => {
    if (isOpen && fixedConditions) {
      setSelectedFixed({
        目前城市: fixedConditions.地点 || fixedConditions.目前城市 || '不限',
        期望城市: fixedConditions.期望地点 || fixedConditions.期望城市 || '不限',
        经验年限: fixedConditions.年限 || fixedConditions.经验 || '不限',
        学历: fixedConditions.学历 || fixedConditions.教育 || '不限',
      });
    }
  }, [isOpen, fixedConditions]);

  // 获取当前维度的关键词
  const getKeywords = (dimension) => conditions[dimension] || [];

  // 添加关键词
  const handleAddKeyword = (dimension, keyword) => {
    const current = getKeywords(dimension);
    if (!current.includes(keyword)) {
      onUpdateConditions({
        ...conditions,
        [dimension]: [...current, keyword],
      });
    }
  };

  // 删除关键词
  const handleRemoveKeyword = (dimension, keyword) => {
    const current = getKeywords(dimension);
    onUpdateConditions({
      ...conditions,
      [dimension]: current.filter((k) => k !== keyword),
    });
  };

  // 选择快捷标签
  const handleQuickTag = (dimension, tag) => {
    handleAddKeyword(dimension, tag);
  };

  // 输入框添加
  const handleInputAdd = () => {
    if (!inputValue.trim()) return;
    handleAddKeyword(activeTab, inputValue.trim());
    setInputValue('');
  };

  // 清空某维度
  const handleClearDimension = (dimension) => {
    const newConditions = { ...conditions };
    delete newConditions[dimension];
    onUpdateConditions(newConditions);
  };

  // 清空全部
  const handleClearAll = () => {
    onUpdateConditions({});
    setSelectedFixed({
      目前城市: '不限',
      期望城市: '不限',
      经验年限: '不限',
      学历: '不限',
    });
  };

  // 执行搜索
  const handleSearch = () => {
    onSearch?.();
    onClose?.();
  };

  if (!isOpen) return null;

  const currentConfig = FILTER_DIMENSIONS.find((d) => d.key === activeTab);
  const currentColors = COLOR_MAP[currentConfig?.color || 'purple'];
  const currentKeywords = getKeywords(activeTab);

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#7c3aed]" />
          <span className="text-sm font-medium text-gray-700">AI 搜索条件设置</span>
          <span className="text-xs text-gray-400">(支持手动调整)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-500 hover:text-red-500 px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            清空全部
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 维度标签栏 */}
      <div className="flex items-center gap-1 px-4 py-3 border-b border-gray-100 overflow-x-auto">
        {FILTER_DIMENSIONS.map((dim) => {
          const count = getKeywords(dim.key).length;
          const isActive = activeTab === dim.key;
          const colors = COLOR_MAP[dim.color];

          return (
            <button
              key={dim.key}
              onClick={() => setActiveTab(dim.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? `${colors.bg} ${colors.text} ${colors.border} border`
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{dim.icon}</span>
              <span>{dim.title}</span>
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/50' : 'bg-gray-200'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 当前维度编辑区 */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleInputAdd();
              }}
              placeholder={currentConfig?.placeholder}
              className={`w-full px-3 py-2 pr-20 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-[#7c3aed]/20 ${currentColors.border} ${currentColors.hover}`}
            />
            <button
              onClick={handleInputAdd}
              disabled={!inputValue.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 text-xs bg-[#7c3aed] text-white rounded-md hover:bg-[#6d28d9] disabled:opacity-50 transition-colors"
            >
              添加
            </button>
          </div>
          {currentKeywords.length > 0 && (
            <button
              onClick={() => handleClearDimension(activeTab)}
              className="text-xs text-gray-400 hover:text-red-500 px-2 py-1.5 rounded hover:bg-red-50 whitespace-nowrap"
            >
              清空
            </button>
          )}
        </div>

        {/* 已添加的关键词 */}
        {currentKeywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {currentKeywords.map((keyword, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-sm rounded-full border ${currentColors.bg} ${currentColors.text} ${currentColors.border}`}
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(activeTab, keyword)}
                  className="hover:text-red-500 p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* 快捷标签 */}
        <div className="mb-4">
          <div className="text-xs text-gray-400 mb-2">快捷添加</div>
          <div className="flex flex-wrap gap-2">
            {currentConfig?.quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleQuickTag(activeTab, tag)}
                disabled={currentKeywords.includes(tag)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  currentKeywords.includes(tag)
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : `bg-white text-gray-600 ${currentColors.border} ${currentColors.hover} hover:bg-gray-50`
                }`}
              >
                <Plus size={10} className="inline mr-1" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 固定筛选条件 */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(FIXED_FILTERS).map(([title, options]) => (
            <div key={title}>
              <div className="text-xs text-gray-500 mb-2">{title}</div>
              <div className="flex flex-wrap gap-1">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedFixed((prev) => ({ ...prev, [title]: opt }))}
                    className={`px-2 py-0.5 text-xs rounded transition-colors ${
                      selectedFixed[title] === opt
                        ? 'bg-[#7c3aed] text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#7c3aed] hover:text-[#7c3aed]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>已设置</span>
          {Object.keys(conditions).length > 0 ? (
            <span className="text-[#7c3aed] font-medium">
              {Object.keys(conditions).length} 个维度
            </span>
          ) : (
            <span>暂无条件</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSearch}
            className="flex items-center gap-1.5 px-5 py-2 text-sm bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors"
          >
            <Search size={16} />
            确认搜索
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullSearchPanel;
