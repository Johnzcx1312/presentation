import React from 'react';
import { X } from 'lucide-react';

const SelectedFilters = ({ filters, onRemove, onClearAll }) => {
  if (!filters || filters.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
      <span className="text-sm text-gray-500">已选条件：</span>
      <div className="flex items-center gap-2 flex-1 flex-wrap">
        {filters.map((filter, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-50 text-primary rounded border border-purple-100"
          >
            {filter}
            <button
              onClick={() => onRemove(filter)}
              className="hover:text-primary-dark"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <button
        onClick={onClearAll}
        className="text-sm text-gray-500 hover:text-primary flex items-center gap-1"
      >
        <X size={14} />
        清除全部
      </button>
      <button className="text-sm text-primary hover:text-primary-dark font-medium">
        保存搜索条件
      </button>
    </div>
  );
};

export default SelectedFilters;
