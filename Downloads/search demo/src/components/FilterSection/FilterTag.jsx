import React from 'react';
import { Bell, BellPlus, X } from 'lucide-react';

const FilterTag = ({ label, count, isNew, isSubscribed, onClick, onSubscribe }) => {
  return (
    <div className="inline-flex items-center">
      <button
        onClick={onClick}
        className={`
          inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-l border transition-all duration-200
          ${isSubscribed 
            ? 'bg-[#f3f0ff] border-[#7c3aed] text-[#5b21b6]' 
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
          }
        `}
      >
        <span>{label}</span>
        {isNew && count > 0 && (
          <span className="text-xs text-red-500 font-medium">新增{count}</span>
        )}
      </button>
      
      <button
        onClick={onSubscribe}
        className={`
          px-2 py-1.5 rounded-r border border-l-0 transition-all duration-200
          ${isSubscribed 
            ? 'bg-[#f3f0ff] border-[#7c3aed] text-[#7c3aed] hover:bg-[#ede9fe]' 
            : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }
        `}
        title={isSubscribed ? '取消订阅' : '订阅'}
      >
        {isSubscribed ? <BellPlus size={14} /> : <Bell size={14} />}
      </button>
    </div>
  );
};

export default FilterTag;
