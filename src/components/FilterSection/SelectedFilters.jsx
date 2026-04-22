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
            className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-[#f5f3ff] text-[#7c3aed] rounded border border-[#ddd6fe]"
          >
            {filter}
            <button
              onClick={() => onRemove(filter)}
              className="hover:text-[#5b21b6]"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <button
        onClick={onClearAll}
        className="text-sm text-gray-500 hover:text-[#7c3aed] flex items-center gap-1"
      >
        <X size={14} />
        清除全部
      </button>
      <button className="text-sm text-[#7c3aed] font-medium px-3 py-1.5 bg-[#f5f3ff] rounded border border-[#ddd6fe] hover:bg-[#ede9fe]">
        保存搜索条件
      </button>
    </div>
  );
};

export default SelectedFilters;
