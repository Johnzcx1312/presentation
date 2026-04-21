import React from 'react';
import { X } from 'lucide-react';

const SelectedFilters = ({ filters, onRemove, onClearAll }) => {
  if (!filters || filters.length === 0) return null;

  return (
    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
      <span className="text-sm text-gray-500 font-medium">已选条件：</span>
      <div className="flex items-center gap-2 flex-1 flex-wrap">
        {filters.map((filter, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#f3f0ff] text-[#5b21b6] rounded-lg border border-[#ddd6fe] font-medium"
          >
            {filter}
            <button
              onClick={() => onRemove(filter)}
              className="hover:text-[#4c1d95] p-0.5 rounded-full hover:bg-[#ede9fe] transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <button
        onClick={onClearAll}
        className="text-sm text-gray-500 hover:text-[#5b21b6] flex items-center gap-1.5 transition-colors"
      >
        <X size={16} />
        清除全部
      </button>
      <button className="text-sm text-[#5b21b6] hover:text-[#4c1d95] font-medium px-4 py-2 bg-[#f3f0ff] rounded-lg hover:bg-[#ede9fe] transition-colors">
        保存搜索条件
      </button>
    </div>
  );
};

export default SelectedFilters;
