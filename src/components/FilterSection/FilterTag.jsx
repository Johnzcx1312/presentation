import React from 'react';
import { Bell, BellRing } from 'lucide-react';

const FilterTag = ({ label, count, isNew, isSubscribed, onClick, onSubscribe }) => {
  return (
    <div className="inline-flex items-center">
      <button
        onClick={onClick}
        className={`
          inline-flex items-center gap-1 px-2 py-1 text-sm border-y border-l rounded-l
          ${isSubscribed 
            ? 'bg-[#f5f3ff] border-[#ddd6fe] text-[#7c3aed]' 
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
          }
        `}
      >
        <span>{label}</span>
        {isNew && count > 0 && (
          <span className="text-xs text-red-500">新增{count}</span>
        )}
      </button>
      
      <button
        onClick={onSubscribe}
        className={`
          px-1.5 py-1 text-xs border-y border-r rounded-r
          ${isSubscribed 
            ? 'bg-[#f5f3ff] border-[#ddd6fe] text-[#7c3aed]' 
            : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600'
          }
        `}
        title={isSubscribed ? '取消订阅' : '订阅'}
      >
        {isSubscribed ? <BellRing size={12} /> : <Bell size={12} />}
      </button>
    </div>
  );
};

export default FilterTag;
