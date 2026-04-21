import React, { useState } from 'react';
import FilterGroup from './FilterGroup';
import FilterTag from './FilterTag';
import SelectedFilters from './SelectedFilters';
import { filterOptions } from '../../data/mockData';
import { ChevronDown, ChevronUp, X, BellPlus } from 'lucide-react';

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

  // 更多筛选项数据
  const moreFilters = [
    { title: '活跃状态', options: ['不限', '今日活跃', '3天内活跃', '7天内活跃', '30天内活跃'] },
    { title: '求职状态', options: ['不限', '在职-暂不考虑', '在职-考虑机会', '离职-随时到岗'] },
    { title: '跳槽频率', options: ['不限', '稳定（>3年）', '正常（1-3年）', '频繁（<1年）'] },
    { title: '性别要求', options: ['不限', '男', '女'] },
    { title: '语言要求', options: ['不限', '英语', '日语', '韩语', '其他'] },
    { title: '毕业年份', options: ['不限', '2024', '2023', '2022', '2021', '2020'] },
    { title: '当前行业', options: ['不限', '互联网', '金融', '教育', '医疗', '制造'] },
    { title: '期望行业', options: ['不限', '互联网', '金融', '教育', '医疗', '制造'] },
  ];

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm mb-4">
      {/* 快捷搜索标签 */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
        <span className="text-sm text-gray-500 font-medium w-16">快捷搜索</span>
        <div className="flex items-center gap-2 flex-wrap">
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
        <button className="ml-auto text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
          <X size={16} />
          清除全部
        </button>
      </div>

      {/* 目前城市 */}
      <div className="flex items-start gap-4 py-2.5 border-b border-gray-100">
        <span className="text-sm text-gray-500 w-16 flex-shrink-0 pt-1">目前城市</span>
        <div className="flex-1 flex flex-wrap gap-2">
          {filterOptions.currentCities.map((city) => (
            <button
              key={city}
              onClick={() => toggleCity(city)}
              className={`
                px-3 py-1 text-sm rounded transition-all duration-200
                ${city === '不限' && activeCities.length === 0
                  ? 'text-[#5b21b6] font-semibold bg-[#f3f0ff]'
                  : activeCities.includes(city)
                    ? 'text-[#5b21b6] font-semibold bg-[#f3f0ff]'
                    : 'text-gray-600 hover:text-[#5b21b6] hover:bg-gray-50'
                }
              `}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* 期望城市 */}
      <div className="flex items-start gap-4 py-2.5 border-b border-gray-100">
        <span className="text-sm text-gray-500 w-16 flex-shrink-0 pt-1">期望城市</span>
        <div className="flex-1 flex flex-wrap gap-2">
          {filterOptions.expectCities.map((city) => (
            <button
              key={city}
              className={`
                px-3 py-1 text-sm rounded transition-all duration-200
                ${city === '不限' 
                  ? 'text-[#5b21b6] font-semibold bg-[#f3f0ff]' 
                  : 'text-gray-600 hover:text-[#5b21b6] hover:bg-gray-50'
                }
              `}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
      
      {/* 工作经验 */}
      <div className="flex items-start gap-4 py-2.5 border-b border-gray-100">
        <span className="text-sm text-gray-500 w-16 flex-shrink-0 pt-1">经验</span>
        <div className="flex-1 flex flex-wrap items-center gap-2">
          {filterOptions.experience.map((option) => (
            <button
              key={option}
              onClick={() => setActiveExp(option)}
              className={`
                px-3 py-1 text-sm rounded transition-all duration-200
                ${activeExp === option
                  ? 'text-[#5b21b6] font-semibold bg-[#f3f0ff]'
                  : 'text-gray-600 hover:text-[#5b21b6] hover:bg-gray-50'
                }
              `}
            >
              {option}
            </button>
          ))}
          <span className="text-sm text-[#5b21b6] font-medium ml-2">自定义</span>
          <div className="flex items-center gap-1 ml-2">
            <input 
              type="text" 
              placeholder="5" 
              className="w-14 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:border-[#7c3aed] focus:outline-none focus:ring-1 focus:ring-[#ddd6fe]"
            />
            <span className="text-sm text-gray-400">-</span>
            <input 
              type="text" 
              placeholder="" 
              className="w-14 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:border-[#7c3aed] focus:outline-none focus:ring-1 focus:ring-[#ddd6fe]"
            />
            <span className="text-sm text-gray-500">年</span>
          </div>
        </div>
      </div>

      {/* 教育经历 */}
      <div className="flex items-start gap-4 py-2.5 border-b border-gray-100">
        <span className="text-sm text-gray-500 w-16 flex-shrink-0 pt-1">教育经历</span>
        <div className="flex-1 flex flex-wrap gap-2">
          {filterOptions.education.map((edu) => (
            <button
              key={edu}
              onClick={() => toggleEdu(edu)}
              className={`
                px-3 py-1 text-sm rounded transition-all duration-200
                ${edu === '不限' && activeEdu.length === 0
                  ? 'text-[#5b21b6] font-semibold bg-[#f3f0ff]'
                  : activeEdu.includes(edu)
                    ? 'text-[#5b21b6] font-semibold bg-[#f3f0ff]'
                    : 'text-gray-600 hover:text-[#5b21b6] hover:bg-gray-50'
                }
              `}
            >
              {edu}
            </button>
          ))}
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-500 hover:text-[#5b21b6] transition-colors">
            院校要求
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* 其他筛选行 */}
      <div className="flex items-center gap-6 py-2.5 border-b border-gray-100">
        <span className="text-sm text-gray-500 w-16 flex-shrink-0">其他筛选</span>
        <div className="flex items-center gap-4 flex-wrap">
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-[#5b21b6] transition-colors">
            活跃状态
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-[#5b21b6] transition-colors">
            求职状态
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-[#5b21b6] transition-colors">
            跳槽频率
            <ChevronDown size={14} />
          </button>
          <button className="px-3 py-1 text-sm text-[#5b21b6] font-semibold bg-[#f3f0ff] rounded">
            30-35岁
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-[#5b21b6] transition-colors">
            性别要求
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-[#5b21b6] transition-colors">
            语言要求
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-[#5b21b6] transition-colors">
            毕业年份
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-[#5b21b6] transition-colors">
            当前行业
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-[#5b21b6] transition-colors">
            期望行业
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-[#5b21b6] transition-colors">
            当前职能
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-[#5b21b6] transition-colors">
            期望职能
            <ChevronDown size={14} />
          </button>
        </div>
        <button 
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className="ml-auto flex items-center gap-1 text-sm text-gray-500 hover:text-[#5b21b6] transition-colors"
        >
          {showMoreFilters ? (
            <>
              <ChevronUp size={16} />
              收起
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              展开更多条件
            </>
          )}
        </button>
      </div>

      {/* 更多筛选 */}
      {showMoreFilters && (
        <div className="mt-2 border-t border-gray-100 pt-2">
          {moreFilters.map((filter) => (
            <FilterGroup 
              key={filter.title} 
              title={filter.title} 
              options={filter.options}
              multiSelect={true}
            />
          ))}
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
