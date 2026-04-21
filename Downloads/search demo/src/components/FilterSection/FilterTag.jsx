import React from 'react';
import { Bell } from 'lucide-react';

const FilterTag = ({ label, count, isNew, isSubscribed, onClick, onSubscribe }) => {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={onClick}
        className={`
          inline-flex items-center gap-1.5 px-2 py-1 text-sm rounded border transition-all duration-200
          ${isSubscribed 
            ? 'bg-purple-50 border-primary text-primary' 
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
          }
        `}
      >
        <span>{label}</span>
        {isNew && (
          <span className="text-xs text-red-500">新增{count}</span>
        )}
        {count > 0 && !isNew && (
          <span className="text-xs text-gray-400">{count}</span>
        )}
      </button>
      
      <button
        onClick={onSubscribe}
        className={`
          p-1 rounded transition-colors
          ${isSubscribed ? 'text-primary hover:bg-purple-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}
        `}
        title={isSubscribed ? '取消订阅' : '订阅'}
      >
        <Bell size={14} />
      </button>
    </div>
  );
};

export default FilterTag;
