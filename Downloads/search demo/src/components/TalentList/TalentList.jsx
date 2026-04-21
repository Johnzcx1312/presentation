import React, { useState } from 'react';
import TalentCard from './TalentCard';
import { talentList } from '../../data/mockData';
import { SlidersHorizontal, FileText, Star, ChevronDown, LayoutGrid, List, CheckSquare } from 'lucide-react';

const TalentList = () => {
  const [sortBy, setSortBy] = useState('智能排序');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [hideViewed, setHideViewed] = useState(false);
  const [matchRecent, setMatchRecent] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [viewMode, setViewMode] = useState('card'); // 'card' | 'list'

  const sortOptions = ['智能排序', '最新活跃', '最近更新', '沟通优先'];

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* 结果统计栏 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">共有</span>
            <span className="text-[#7c3aed] font-bold text-lg">{talentList.length * 77}</span>
            <span className="text-sm text-gray-500">份简历</span>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-[#7c3aed] bg-[#f3f0ff] rounded-lg border border-[#ddd6fe] hover:bg-[#ede9fe] transition-colors font-medium">
            <FileText size={16} />
            AI简历快读
          </button>
        </div>

        <div className="flex items-center gap-5">
          {/* 排序下拉 */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SlidersHorizontal size={16} />
              <span className="font-medium">{sortBy}</span>
              <ChevronDown size={14} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showSortDropdown && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
                {sortOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
                    className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${sortBy === option ? 'text-[#5b21b6] bg-[#f3f0ff] font-medium' : 'text-gray-700'}`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 筛选状态按钮 */}
          <button className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
            沟通状态
          </button>
          <button className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
            获取联系方式状态
          </button>

          {/* 隐藏已查看开关 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-600">隐藏已查看</span>
            <button
              onClick={() => setHideViewed(!hideViewed)}
              className={`w-10 h-5 rounded-full transition-colors relative ${hideViewed ? 'bg-[#7c3aed]' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${hideViewed ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </label>

          {/* 只匹配最近一段工作开关 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-gray-600">只匹配最近一段工作</span>
            <button
              onClick={() => setMatchRecent(!matchRecent)}
              className={`w-10 h-5 rounded-full transition-colors relative ${matchRecent ? 'bg-[#7c3aed]' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${matchRecent ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </label>

          {/* 视图切换 */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded ${viewMode === 'card' ? 'bg-[#f3f0ff] text-[#7c3aed]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#f3f0ff] text-[#7c3aed]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={16} />
            </button>
          </div>

          {/* 收藏夹 */}
          <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
            <Star size={16} />
            收藏夹
          </button>
        </div>
      </div>

      {/* 人才卡片列表 */}
      <div className="divide-y divide-gray-100">
        {talentList.map((talent) => (
          <TalentCard key={talent.id} talent={talent} />
        ))}
      </div>

      {/* 底部批量操作栏 */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed] focus:ring-offset-0 cursor-pointer" 
              />
            </div>
            <span className="text-sm text-gray-600">全选</span>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm text-[#7c3aed] bg-white border border-[#7c3aed] rounded-lg hover:bg-[#f3f0ff] transition-colors font-medium">
            <FileText size={18} />
            浏览简历
          </button>
        </div>
      </div>
    </div>
  );
};

export default TalentList;
