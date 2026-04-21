import React, { useState } from 'react';
import TalentCard from './TalentCard';
import { talentList } from '../../data/mockData';
import { SlidersHorizontal, Eye, EyeOff, FileText, Star, ChevronDown } from 'lucide-react';

const TalentList = () => {
  const [sortBy, setSortBy] = useState('智能排序');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [hideViewed, setHideViewed] = useState(false);
  const [matchRecent, setMatchRecent] = useState(false);
  const [selectedTalents, setSelectedTalents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const sortOptions = ['智能排序', '最新活跃', '最近更新', '沟通优先'];

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTalents([]);
    } else {
      setSelectedTalents(talentList.map(t => t.id));
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 结果统计栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">共有</span>
            <span className="text-primary font-semibold">{talentList.length * 77}</span>
            <span className="text-sm text-gray-500">份简历</span>
          </div>
          
          <button className="flex items-center gap-1 px-3 py-1 text-sm text-primary bg-purple-50 rounded border border-purple-100 hover:bg-purple-100 transition-colors">
            <FileText size={14} />
            AI简历快读
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* 排序下拉 */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-2 py-1"
            >
              <SlidersHorizontal size={14} />
              {sortBy}
              <ChevronDown size={14} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-10">
                {sortOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${sortBy === option ? 'text-primary bg-purple-50' : 'text-gray-700'}`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 筛选状态 */}
          <button className="text-sm text-gray-600 hover:text-gray-900">
            沟通状态
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            获取联系方式状态
          </button>

          {/* 开关选项 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-600">隐藏已查看</span>
            <button
              onClick={() => setHideViewed(!hideViewed)}
              className={`w-8 h-4 rounded-full transition-colors relative ${hideViewed ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${hideViewed ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-600">只匹配最近一段工作</span>
            <button
              onClick={() => setMatchRecent(!matchRecent)}
              className={`w-8 h-4 rounded-full transition-colors relative ${matchRecent ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${matchRecent ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </label>

          {/* 收藏夹 */}
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            <Star size={14} />
            收藏夹
          </button>
        </div>
      </div>

      {/* 人才卡片列表 */}
      <div className="divide-y divide-gray-100">
        {talentList.map((talent) => (
          <div key={talent.id} className="px-4 py-2">
            <TalentCard talent={talent} />
          </div>
        ))}
      </div>

      {/* 底部批量操作栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" 
          />
          <span className="text-sm text-gray-600">全选</span>
        </label>

        <button className="flex items-center gap-2 px-4 py-2 text-sm text-primary bg-white border border-primary rounded hover:bg-purple-50 transition-colors">
          <FileText size={16} />
          浏览简历
        </button>
      </div>
    </div>
  );
};

export default TalentList;
