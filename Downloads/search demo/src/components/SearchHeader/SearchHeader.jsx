import React, { useState } from 'react';
import Button from '../common/Button';
import { Search, Cpu, ChevronDown, X, Plus } from 'lucide-react';

const SearchHeader = () => {
  const [keywords, setKeywords] = useState(['研发', 'JAVA']);
  const [inputValue, setInputValue] = useState('');
  const [isComplexMode, setIsComplexMode] = useState(false);
  const [position, setPosition] = useState('不限职位');
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);

  const positions = ['不限职位', '研发', '产品', '设计', '运营', '市场', '销售', '职能'];

  const handleAddKeyword = () => {
    if (inputValue.trim() && !keywords.includes(inputValue.trim())) {
      setKeywords([...keywords, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddKeyword();
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
      {/* 第一行：职位选择 + 关键词输入 */}
      <div className="flex items-center gap-3">
        {/* 职位选择 */}
        <div className="relative">
          <button
            onClick={() => setShowPositionDropdown(!showPositionDropdown)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded hover:border-gray-400 text-sm text-gray-700 bg-white"
          >
            {position}
            <ChevronDown size={16} className={`transition-transform ${showPositionDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showPositionDropdown && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-20">
              {positions.map((pos) => (
                <div
                  key={pos}
                  onClick={() => { setPosition(pos); setShowPositionDropdown(false); }}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 ${position === pos ? 'text-primary bg-purple-50' : 'text-gray-700'}`}
                >
                  {pos}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 关键词输入区 */}
        <div className="flex-1 flex items-center border border-gray-300 rounded px-3 py-2 hover:border-gray-400 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary-light">
          {/* 关键词标签 */}
          <div className="flex items-center gap-2 flex-wrap">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-primary text-sm rounded border border-purple-100"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(index)}
                  className="hover:text-primary-dark"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            
            {/* 输入框 */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={keywords.length === 0 ? "请输入关键词" : ""}
              className="flex-1 min-w-[100px] outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* +1 提示 */}
          {keywords.length > 2 && (
            <span className="ml-2 text-xs text-primary bg-purple-50 px-1.5 py-0.5 rounded">
              +{keywords.length - 2}
            </span>
          )}
        </div>

        {/* 复合关键词开关 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsComplexMode(!isComplexMode)}
            className={`w-10 h-5 rounded-full transition-colors relative ${isComplexMode ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isComplexMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-sm text-gray-600">复合关键词</span>
        </div>

        {/* 搜索按钮 */}
        <Button variant="primary" size="md" className="px-6">
          <Search size={18} className="mr-1" />
          搜索
        </Button>

        {/* AI智搜按钮 */}
        <Button variant="gradient" size="md" className="px-6">
          <Cpu size={18} className="mr-1" />
          AI智搜
        </Button>
      </div>

      {/* 第二行：快捷筛选 */}
      <div className="flex items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">职位</span>
          <div className="flex items-center border border-gray-300 rounded px-3 py-1.5 w-40">
            <input
              type="text"
              placeholder="销售运营 运营"
              className="outline-none text-sm text-gray-700 w-full"
            />
            <button className="text-gray-400 hover:text-gray-600 ml-1">
              <Plus size={16} />
            </button>
          </div>
          <button className="text-gray-500 hover:text-gray-700 text-xs border border-gray-300 rounded px-2 py-1">
            目前职位
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500">公司</span>
          <div className="flex items-center border border-gray-300 rounded px-3 py-1.5 w-40">
            <input
              type="text"
              placeholder="搜索公司"
              className="outline-none text-sm text-gray-700 w-full"
            />
          </div>
          <button className="text-gray-500 hover:text-gray-700 text-xs border border-gray-300 rounded px-2 py-1">
            目前公司
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
