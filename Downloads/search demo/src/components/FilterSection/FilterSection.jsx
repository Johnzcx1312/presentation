import React, { useState } from 'react';
import FilterGroup from './FilterGroup';
import FilterTag from './FilterTag';
import SelectedFilters from './SelectedFilters';
import { filterOptions } from '../../data/mockData';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FilterSection = () => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(['30-35岁', '本科', '硕士', '5年以上', '北京', '统招本科']);
  const [subscribedTags, setSubscribedTags] = useState(['运营_数据_分析_3']);

  const handleRemoveFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter(f => f !== filter));
  };

  const handleClearAll = () => {
    setSelectedFilters([]);
  };

  const handleSubscribeTag = (tag) => {
    setSubscribedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // 更多筛选项数据
  const moreFilters = [
    { title: '活跃状态', options: ['不限', '今日活跃', '3天内活跃', '7天内活跃', '30天内活跃'] },
    { title: '求职状态', options: ['不限', '在职-暂不考虑', '在职-考虑机会', '离职-随时到岗'] },
    { title: '跳槽频率', options: ['不限', '稳定（>3年）', '正常（1-3年）', '频繁（<1年）'] },
    { title: '性别要求', options: ['不限', '男', '女'] },
    { title: '语言要求', options: ['不限', '英语', '日语', '韩语', '其他'] },
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
      {/* 快捷搜索标签 */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm text-gray-500">快捷搜索</span>
        <div className="flex items-center gap-3">
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
      </div>

      {/* 基础筛选组 */}
      <FilterGroup title="目前城市" options={filterOptions.currentCities} />
      <FilterGroup title="期望城市" options={filterOptions.expectCities} />
      
      {/* 工作经验（含自定义输入） */}
      <div className="flex items-start gap-4 py-2 border-b border-gray-100">
        <span className="text-sm text-gray-500 w-16 flex-shrink-0 pt-1">经验</span>
        <div className="flex-1 flex flex-wrap items-center gap-2">
          {filterOptions.experience.map((option) => (
            <button
              key={option}
              className={`px-3 py-1 text-sm rounded transition-all ${option === '不限' ? 'text-primary font-medium' : 'text-gray-700 hover:text-primary'}`}
            >
              {option}
            </button>
          ))}
          <span className="text-sm text-primary ml-2">自定义</span>
          <div className="flex items-center gap-1 ml-2">
            <input 
              type="text" 
              placeholder="5" 
              className="w-12 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:border-primary focus:outline-none"
            />
            <span className="text-sm text-gray-500">-</span>
            <input 
              type="text" 
              placeholder="" 
              className="w-12 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:border-primary focus:outline-none"
            />
            <span className="text-sm text-gray-500">年</span>
          </div>
        </div>
      </div>

      <FilterGroup title="教育经历" options={filterOptions.education} />

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

      {/* 展开/收起更多筛选 */}
      <div className="flex items-center justify-between mt-2">
        <button
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
        >
          {showMoreFilters ? (
            <>
              <ChevronUp size={16} />
              收起更多条件
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              展开更多条件
            </>
          )}
        </button>
      </div>

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
