import React, { useState } from 'react';

const FilterGroup = ({ title, options, multiSelect = false }) => {
  const [selected, setSelected] = useState(multiSelect ? [] : (options[0] || ''));
  const [showMore, setShowMore] = useState(false);

  const handleSelect = (option) => {
    if (multiSelect) {
      setSelected(prev => 
        prev.includes(option)
          ? prev.filter(item => item !== option)
          : [...prev, option]
      );
    } else {
      setSelected(option);
    }
  };

  const displayOptions = showMore ? options : options.slice(0, 8);

  return (
    <div className="flex items-start gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 w-16 flex-shrink-0 pt-1">{title}</span>
      <div className="flex-1 flex flex-wrap gap-2">
        {displayOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`
              px-3 py-1 text-sm rounded transition-all duration-200
              ${multiSelect 
                ? selected.includes(option)
                  ? 'bg-purple-50 text-primary border border-primary'
                  : 'text-gray-700 hover:bg-gray-50 border border-transparent'
                : selected === option
                  ? 'text-primary font-medium'
                  : 'text-gray-700 hover:text-primary'
              }
            `}
          >
            {option}
          </button>
        ))}
        
        {options.length > 8 && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="px-2 py-1 text-xs text-gray-500 hover:text-primary"
          >
            {showMore ? '收起' : '更多'}
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterGroup;
