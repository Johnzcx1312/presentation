import React, { useState } from 'react';
import FilterGroup from './FilterGroup';
import FilterTag from './FilterTag';
import SelectedFilters from './SelectedFilters';
import { filterOptions } from '../../data/mockData';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const FilterSection = () => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(['30-35岁', '本科', '硕士', '5年以上', '北京', '统招本科']);
  const [subscribedTags, setSubscribedTags] = useState(['运营_数据_分析_3']);
  const [activeCities, setActiveCities] = useState(['北京']);
  const [activeExp, setActiveExp] = useState('不限');
  const [activeEdu, setActiveEdu] = useState(['本科', '硕士']);

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
          <X size={14} />
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
              <>
                <ChevronUp size={14} />
                收起
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                展开更多条件
              </>
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
