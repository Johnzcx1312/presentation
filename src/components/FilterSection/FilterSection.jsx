import React, { useState } from 'react';
import FilterGroup from './FilterGroup';
import FilterTag from './FilterTag';
import SelectedFilters from './SelectedFilters';
import { filterOptions } from '../../data/mockData';
import { ChevronDown, ChevronUp, Sparkles, CheckCircle } from 'lucide-react';

const FilterSection = ({ isAIConditions = false }) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(['30-35岁', '本科', '硕士', '5年以上', '北京', '统招本科']);
  const [subscribedTags, setSubscribedTags] = useState(['运营_数据_分析_3']);
  const [activeCities, setActiveCities] = useState(['北京']);
  const [activeExp, setActiveExp] = useState('不限');
  const [activeEdu, setActiveEdu] = useState(['本科', '硕士']);

  // AI自动识别的条件（只读展示）
  const aiRecognizedConditions = [
    { category: '工作经验', value: '3-5年', confidence: 95 },
    { category: '学历', value: '本科及以上', confidence: 98 },
    { category: '目前城市', value: '北京', confidence: 92 },
    { category: '技能', value: 'Java、Spring Boot、微服务', confidence: 88 },
    { category: '薪资范围', value: '25-35K', confidence: 90 },
    { category: '年龄', value: '30-35岁', confidence: 85 },
  ];

  const handleRemoveFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter(f => f !== filter));
  };

  const handleClearAll = () => {
    setSelectedFilters([]);
    setActiveCities([]);
    setActiveExp('不限');
    setActiveEdu([]);
  };

  const handleSubscribeTag = (tag) => {
    setSubscribedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleCity = (city) => {
    if (city === '不限') {
      setActiveCities([]);
    } else {
      setActiveCities(prev => 
        prev.includes(city) 
          ? prev.filter(c => c !== city)
          : [...prev.filter(c => c !== '不限'), city]
      );
    }
  };

  const toggleEdu = (edu) => {
    if (edu === '不限') {
      setActiveEdu([]);
    } else {
      setActiveEdu(prev => 
        prev.includes(edu) 
          ? prev.filter(e => e !== edu)
          : [...prev.filter(e => e !== '不限'), edu]
      );
    }
  };

  if (isAIConditions) {
    // AI条件只读展示模式
    return (
      <div className="space-y-3">
        {/* AI识别的条件展示 - 顶部标签 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {aiRecognizedConditions.map((condition, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#ddd6fe] rounded-lg shadow-sm"
            >
              <span className="text-xs text-gray-500">{condition.category}</span>
              <span className="text-sm font-medium text-[#7c3aed]">{condition.value}</span>
              <span className="text-xs text-green-600 font-medium">{condition.confidence}%</span>
            </div>
          ))}
        </div>

        {/* 快捷搜索标签（AI自动订阅） */}
        <div className="flex items-start gap-3 py-2 border-t border-[#ede9fe]">
          <span className="text-xs text-gray-500 w-16 pt-1">快捷搜索</span>
          <div className="flex-1 flex items-center gap-2 flex-wrap">
            {filterOptions.quickFilters.slice(0, 3).map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#f5f3ff] text-[#7c3aed] rounded border border-[#ddd6fe]"
              >
                {filter.label}
                <CheckCircle size={10} />
              </span>
            ))}
          </div>
        </div>

        {/* 目前城市 */}
        <div className="flex items-start gap-3 py-2 border-t border-[#ede9fe]">
          <span className="text-xs text-gray-500 w-16 pt-1">目前城市</span>
          <div className="flex-1 flex flex-wrap gap-1">
            <span className="px-2 py-1 text-xs bg-[#f5f3ff] text-[#7c3aed] font-medium rounded">北京</span>
            <span className="px-2 py-1 text-xs text-gray-400">上海</span>
            <span className="px-2 py-1 text-xs text-gray-400">深圳</span>
            <span className="px-2 py-1 text-xs text-gray-400">其他</span>
          </div>
        </div>

        {/* 期望城市 */}
        <div className="flex items-start gap-3 py-2 border-t border-[#ede9fe]">
          <span className="text-xs text-gray-500 w-16 pt-1">期望城市</span>
          <div className="flex-1 flex flex-wrap gap-1">
            <span className="px-2 py-1 text-xs bg-[#f5f3ff] text-[#7c3aed] font-medium rounded">北京</span>
            <span className="px-2 py-1 text-xs text-gray-400">上海</span>
            <span className="px-2 py-1 text-xs text-gray-400">深圳</span>
          </div>
        </div>

        {/* 工作经验 */}
        <div className="flex items-center gap-3 py-2 border-t border-[#ede9fe]">
          <span className="text-xs text-gray-500 w-16">经验</span>
          <div className="flex-1 flex items-center gap-1">
            <span className="px-2 py-1 text-xs bg-[#f5f3ff] text-[#7c3aed] font-medium rounded">3-5年</span>
          </div>
        </div>

        {/* 教育经历 */}
        <div className="flex items-start gap-3 py-2 border-t border-[#ede9fe]">
          <span className="text-xs text-gray-500 w-16 pt-1">教育经历</span>
          <div className="flex-1 flex flex-wrap gap-1">
            <span className="px-2 py-1 text-xs bg-[#f5f3ff] text-[#7c3aed] font-medium rounded">本科</span>
            <span className="px-2 py-1 text-xs bg-[#f5f3ff] text-[#7c3aed] font-medium rounded">硕士</span>
            <span className="px-2 py-1 text-xs text-gray-400">博士/博士后</span>
          </div>
        </div>

        {/* 其他筛选 */}
        <div className="flex items-start gap-3 py-2 border-t border-[#ede9fe]">
          <span className="text-xs text-gray-500 w-16 pt-1">其他筛选</span>
          <div className="flex-1 flex items-center gap-2 flex-wrap">
            <span className="px-2 py-1 text-xs bg-[#f5f3ff] text-[#7c3aed] font-medium rounded">30-35岁</span>
            <span className="px-2 py-1 text-xs text-gray-400">3天内活跃</span>
            <span className="px-2 py-1 text-xs text-gray-400">互联网</span>
          </div>
          <button 
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="flex items-center gap-0.5 text-xs text-[#7c3aed] hover:underline"
          >
            {showMoreFilters ? (
              <><ChevronUp size={12} /> 收起</>
            ) : (
              <><ChevronDown size={12} /> 更多</>
            )}
          </button>
        </div>

        {/* 更多条件展开 */}
        {showMoreFilters && (
          <div className="mt-2 pt-2 border-t border-[#ede9fe] space-y-2">
            <div className="flex items-start gap-3">
              <span className="text-xs text-gray-500 w-16">求职状态</span>
              <div className="flex-1 flex gap-1">
                <span className="px-2 py-1 text-xs text-gray-400">在职-考虑机会</span>
                <span className="px-2 py-1 text-xs text-gray-400">离职-随时到岗</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xs text-gray-500 w-16">技能标签</span>
              <div className="flex-1 flex gap-1 flex-wrap">
                <span className="px-2 py-1 text-xs bg-[#f5f3ff] text-[#7c3aed] rounded">Spring Boot</span>
                <span className="px-2 py-1 text-xs bg-[#f5f3ff] text-[#7c3aed] rounded">微服务</span>
                <span className="px-2 py-1 text-xs bg-[#f5f3ff] text-[#7c3aed] rounded">MySQL</span>
                <span className="px-2 py-1 text-xs bg-[#f5f3ff] text-[#7c3aed] rounded">Redis</span>
              </div>
            </div>
          </div>
        )}

        {/* 底部提示 */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#ede9fe]">
          <Sparkles size={14} className="text-[#7c3aed]" />
          <span className="text-xs text-gray-500">AI根据您的描述自动识别了以上条件，置信度平均 91%</span>
        </div>
      </div>
    );
  }

  // 原有的完整交互模式
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm mb-4">
      {/* 快捷搜索标签 */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-sm text-gray-500 font-medium w-16 pt-1">快捷搜索</span>
        <div className="flex-1 flex items-center gap-2 flex-wrap">
          {filterOptions.quickFilters.map((filter, index) => (
            <FilterTag
              key={index}
              label={filter.label}
              count={filter.count}
              isNew={filter.isNew}
              isSubscribed={subscribedTags.includes(filter.label)}
              onClick={() => {}}
              onSubscribe={() => handleSubscribeTag(filter.label)}
            />
          ))}
        </div>
        <button className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 pt-1">
          <span className="text-lg leading-none">×</span>
          清除全部
        </button>
      </div>

      {/* 目前城市 */}
      <div className="flex items-start gap-3 py-2 border-t border-gray-100">
        <span className="text-sm text-gray-500 w-16 pt-1">目前城市</span>
        <div className="flex-1 flex flex-wrap gap-1">
          {filterOptions.currentCities.map((city) => (
            <button
              key={city}
              onClick={() => toggleCity(city)}
              className={`
                px-3 py-1 text-sm rounded transition-colors
                ${city === '不限' && activeCities.length === 0
                  ? 'text-[#7c3aed] font-medium bg-[#f5f3ff]'
                  : activeCities.includes(city)
                    ? 'text-[#7c3aed] font-medium bg-[#f5f3ff]'
                    : 'text-gray-600 hover:text-[#7c3aed]'
                }
              `}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* 期望城市 */}
      <div className="flex items-start gap-3 py-2 border-t border-gray-100">
        <span className="text-sm text-gray-500 w-16 pt-1">期望城市</span>
        <div className="flex-1 flex flex-wrap gap-1">
          {filterOptions.expectCities.map((city) => (
            <button
              key={city}
              className={`
                px-3 py-1 text-sm rounded transition-colors
                ${city === '不限' 
                  ? 'text-[#7c3aed] font-medium bg-[#f5f3ff]' 
                  : 'text-gray-600 hover:text-[#7c3aed]'
                }
              `}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
      
      {/* 工作经验 */}
      <div className="flex items-center gap-3 py-2 border-t border-gray-100">
        <span className="text-sm text-gray-500 w-16">经验</span>
        <div className="flex-1 flex items-center gap-1">
          {filterOptions.experience.map((option) => (
            <button
              key={option}
              onClick={() => setActiveExp(option)}
              className={`
                px-3 py-1 text-sm rounded transition-colors
                ${activeExp === option
                  ? 'text-[#7c3aed] font-medium bg-[#f5f3ff]'
                  : 'text-gray-600 hover:text-[#7c3aed]'
                }
              `}
            >
              {option}
            </button>
          ))}
          <span className="text-sm text-[#7c3aed] ml-2">自定义</span>
          <div className="flex items-center gap-1 ml-2">
            <input 
              type="text" 
              placeholder="5" 
              className="w-12 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:border-[#7c3aed] focus:outline-none"
            />
            <span className="text-sm text-gray-400">-</span>
            <input 
              type="text" 
              placeholder="" 
              className="w-12 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:border-[#7c3aed] focus:outline-none"
            />
            <span className="text-sm text-gray-500">年</span>
          </div>
        </div>
      </div>

      {/* 教育经历 */}
      <div className="flex items-start gap-3 py-2 border-t border-gray-100">
        <span className="text-sm text-gray-500 w-16 pt-1">教育经历</span>
        <div className="flex-1 flex flex-wrap gap-1 items-center">
          {filterOptions.education.map((edu) => (
            <button
              key={edu}
              onClick={() => toggleEdu(edu)}
              className={`
                px-3 py-1 text-sm rounded transition-colors
                ${edu === '不限' && activeEdu.length === 0
                  ? 'text-[#7c3aed] font-medium bg-[#f5f3ff]'
                  : activeEdu.includes(edu)
                    ? 'text-[#7c3aed] font-medium bg-[#f5f3ff]'
                    : 'text-gray-600 hover:text-[#7c3aed]'
                }
              `}
            >
              {edu}
            </button>
          ))}
          <button className="flex items-center gap-0.5 px-2 py-1 text-sm text-gray-500 hover:text-[#7c3aed]">
            院校要求
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* 其他筛选 */}
      <div className="flex items-start gap-3 py-2 border-t border-gray-100">
        <span className="text-sm text-gray-500 w-16 pt-1">其他筛选</span>
        <div className="flex-1 flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-0.5 px-2 py-1 text-sm text-gray-600 hover:text-[#7c3aed]">
            活跃状态
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-0.5 px-2 py-1 text-sm text-gray-600 hover:text-[#7c3aed]">
            求职状态
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-0.5 px-2 py-1 text-sm text-gray-600 hover:text-[#7c3aed]">
            跳槽频率
            <ChevronDown size={14} />
          </button>
          <button className="px-2 py-1 text-sm text-[#7c3aed] font-medium bg-[#f5f3ff] rounded">
            30-35岁
          </button>
          <button className="flex items-center gap-0.5 px-2 py-1 text-sm text-gray-600 hover:text-[#7c3aed]">
            性别要求
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-0.5 px-2 py-1 text-sm text-gray-600 hover:text-[#7c3aed]">
            语言要求
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-0.5 px-2 py-1 text-sm text-gray-600 hover:text-[#7c3aed]">
            毕业年份
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-0.5 px-2 py-1 text-sm text-gray-600 hover:text-[#7c3aed]">
            当前行业
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-0.5 px-2 py-1 text-sm text-gray-600 hover:text-[#7c3aed]">
            期望行业
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-0.5 px-2 py-1 text-sm text-gray-600 hover:text-[#7c3aed]">
            当前职能
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-0.5 px-2 py-1 text-sm text-gray-600 hover:text-[#7c3aed]">
            期望职能
            <ChevronDown size={14} />
          </button>
          <button 
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="flex items-center gap-0.5 text-sm text-gray-500 hover:text-[#7c3aed] ml-auto"
          >
            {showMoreFilters ? (
              <><ChevronUp size={14} /> 收起</>
            ) : (
              <><ChevronDown size={14} /> 展开更多条件</>
            )}
          </button>
        </div>
      </div>

      {/* 更多筛选 */}
      {showMoreFilters && (
        <div className="mt-2 border-t border-gray-100 pt-2">
          <FilterGroup title="活跃状态" options={['不限', '今日活跃', '3天内活跃', '7天内活跃', '30天内活跃']} multiSelect={true} />
          <FilterGroup title="求职状态" options={['不限', '在职-暂不考虑', '在职-考虑机会', '离职-随时到岗']} multiSelect={true} />
        </div>
      )}

      {/* 已选条件 */}
      <SelectedFilters 
        filters={selectedFilters}
        onRemove={handleRemoveFilter}
        onClearAll={handleClearAll}
      />
    </div>
  );
};

export default FilterSection;
