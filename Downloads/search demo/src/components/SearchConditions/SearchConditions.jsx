import React, { useState } from 'react';
import { X, Plus, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

// 维度配置
const DIMENSIONS = {
  职位: { color: 'purple', icon: '💼', placeholder: '添加职位关键词' },
  公司: { color: 'green', icon: '🏢', placeholder: '添加公司关键词' },
  技能: { color: 'blue', icon: '⚡', placeholder: '添加技能关键词' },
  行业: { color: 'orange', icon: '📊', placeholder: '添加行业关键词' },
  业务方向: { color: 'cyan', icon: '🎯', placeholder: '添加业务方向' },
  分析方向: { color: 'pink', icon: '📈', placeholder: '添加分析方向' },
  职责重点: { color: 'indigo', icon: '🔍', placeholder: '添加职责重点' },
  专业技能: { color: 'teal', icon: '🛠️', placeholder: '添加专业技能' },
};

const COLOR_MAP = {
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-200' },
};

const SearchConditions = ({ 
  isOpen, 
  onToggle, 
  conditions = {}, 
  onUpdateConditions,
  hasUpdate = false,
  onClearUpdate 
}) => {
  const [editingDimension, setEditingDimension] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // 获取所有维度（包括已有的和建议的）
  const allDimensions = Object.keys(DIMENSIONS);
  const activeDimensions = allDimensions.filter(dim => 
    conditions[dim] && conditions[dim].length > 0
  );
  const emptyDimensions = allDimensions.filter(dim => 
    !conditions[dim] || conditions[dim].length === 0
  );

  // 添加关键词
  const handleAddKeyword = (dimension) => {
    if (!inputValue.trim()) return;
    
    const current = conditions[dimension] || [];
    if (!current.includes(inputValue.trim())) {
      onUpdateConditions({
        ...conditions,
        [dimension]: [...current, inputValue.trim()],
      });
    }
    setInputValue('');
    setEditingDimension(null);
  };

  // 删除关键词
  const handleRemoveKeyword = (dimension, keyword) => {
    const current = conditions[dimension] || [];
    onUpdateConditions({
      ...conditions,
      [dimension]: current.filter(k => k !== keyword),
    });
  };

  // 清空某维度
  const handleClearDimension = (dimension) => {
    const newConditions = { ...conditions };
    delete newConditions[dimension];
    onUpdateConditions(newConditions);
  };

  // 开始编辑某维度
  const handleStartEdit = (dimension) => {
    setEditingDimension(dimension);
    setInputValue('');
  };

  // 渲染维度卡片
  const renderDimensionCard = (dimension, isActive) => {
    const config = DIMENSIONS[dimension];
    const colors = COLOR_MAP[config.color];
    const keywords = conditions[dimension] || [];
    const isEditing = editingDimension === dimension;

    return (
      <div 
        key={dimension}
        className={`rounded-lg border ${isActive ? colors.border : 'border-gray-200'} ${isActive ? colors.bg : 'bg-white'} p-3`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${isActive ? colors.text : 'text-gray-500'}`}>
              {config.icon} {dimension}
            </span>
            {keywords.length > 0 && (
              <span className="text-xs text-gray-400">({keywords.length})</span>
            )}
          </div>
          {keywords.length > 0 && (
            <button
              onClick={() => handleClearDimension(dimension)}
              className="text-gray-400 hover:text-red-500 p-0.5"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* 关键词列表 */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {keywords.map((keyword, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
            >
              {keyword}
              <button
                onClick={() => handleRemoveKeyword(dimension, keyword)}
                className="hover:text-red-500"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>

        {/* 添加输入框 */}
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddKeyword(dimension);
                if (e.key === 'Escape') setEditingDimension(null);
              }}
              placeholder={config.placeholder}
              className={`flex-1 text-xs px-2 py-1 rounded border ${colors.border} outline-none focus:ring-1 focus:ring-[#7c3aed]`}
              autoFocus
            />
            <button
              onClick={() => handleAddKeyword(dimension)}
              disabled={!inputValue.trim()}
              className="px-2 py-1 text-xs bg-[#7c3aed] text-white rounded hover:bg-[#6d28d9] disabled:opacity-50"
            >
              添加
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleStartEdit(dimension)}
            className={`flex items-center gap-1 text-xs text-gray-500 hover:text-[#7c3aed] px-2 py-1 rounded hover:bg-white/50`}
          >
            <Plus size={12} />
            添加{dimension}词
          </button>
        )}
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => {
            onToggle();
            if (hasUpdate) onClearUpdate?.();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            hasUpdate 
              ? 'bg-[#f5f3ff] border-[#7c3aed] text-[#7c3aed] hover:bg-[#ede9fe]' 
              : 'bg-white border-gray-200 text-gray-600 hover:border-[#7c3aed] hover:text-[#7c3aed]'
          }`}
        >
          <Sparkles size={16} className={hasUpdate ? 'animate-pulse' : ''} />
          <span className="text-sm font-medium">
            {hasUpdate ? 'AI 已更新搜索条件' : '设置搜索条件'}
          </span>
          {activeDimensions.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
              {activeDimensions.length}个维度
            </span>
          )}
          {hasUpdate && (
            <span className="w-2 h-2 bg-[#7c3aed] rounded-full animate-pulse" />
          )}
        </button>
        
        {activeDimensions.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {activeDimensions.slice(0, 3).map(dim => {
              const colors = COLOR_MAP[DIMENSIONS[dim].color];
              const count = conditions[dim]?.length || 0;
              return (
                <span 
                  key={dim}
                  className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text}`}
                >
                  {DIMENSIONS[dim].icon} {dim}({count})
                </span>
              );
            })}
            {activeDimensions.length > 3 && (
              <span className="text-xs text-gray-400">+{activeDimensions.length - 3}</span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#7c3aed]" />
          <span className="text-sm font-medium text-gray-700">搜索条件设置</span>
          <span className="text-xs text-gray-400">
            (AI 拆词结果已同步，可手动调整)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateConditions({})}
            className="text-xs text-gray-500 hover:text-red-500 px-2 py-1 rounded hover:bg-red-50"
          >
            清空全部
          </button>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <ChevronUp size={18} />
          </button>
        </div>
      </div>

      {/* 条件区域 */}
      <div className="p-4">
        {/* 有内容的维度 */}
        {activeDimensions.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2">已设置维度</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeDimensions.map(dim => renderDimensionCard(dim, true))}
            </div>
          </div>
        )}

        {/* 可添加的维度 */}
        {emptyDimensions.length > 0 && (
          <div>
            <div className="text-xs text-gray-400 mb-2">可添加维度</div>
            <div className="flex flex-wrap gap-2">
              {emptyDimensions.map(dim => {
                const config = DIMENSIONS[dim];
                return (
                  <button
                    key={dim}
                    onClick={() => handleStartEdit(dim)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-[#7c3aed] hover:text-[#7c3aed] transition-colors"
                  >
                    <Plus size={12} />
                    {config.icon} {dim}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchConditions;
