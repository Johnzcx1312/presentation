import React, { useState } from 'react';
import { Search, Cpu, ChevronDown, X, XCircle } from 'lucide-react';

const SearchHeader = () => {
  const [keywords, setKeywords] = useState(['研发', 'JAVA']);
  const [inputValue, setInputValue] = useState('');
  const [isComplexMode, setIsComplexMode] = useState(false);
  const [position, setPosition] = useState('不限职位');
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [currentJob, setCurrentJob] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');

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

  const clearAllKeywords = () => {
    setKeywords([]);
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm mb-4">
      {/* 主搜索栏 - 猎聘风格的大搜索框 */}
      <div className="flex items-stretch h-12">
        {/* 职位选择下拉 */}
        <div className="relative">
          <button
            onClick={() => setShowPositionDropdown(!showPositionDropdown)}
            className="h-full px-4 bg-white border border-r-0 border-gray-300 rounded-l-md hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2"
          >
            {position}
            <ChevronDown size={14} className={`transition-transform ${showPositionDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showPositionDropdown && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1">
              {positions.map((pos) => (
                <div
                  key={pos}
                  onClick={() => { setPosition(pos); setShowPositionDropdown(false); }}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${position === pos ? 'text-[#7c3aed] bg-purple-50' : 'text-gray-700'}`}
                >
                  {pos}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 关键词输入区 */}
        <div className="flex-1 flex items-center border border-gray-300 bg-white px-3">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#f5f3ff] text-[#7c3aed] text-sm rounded border border-[#ddd6fe]"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(index)}
                  className="hover:text-[#5b21b6]"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={keywords.length === 0 ? "请输入关键词" : ""}
              className="flex-1 min-w-[150px] outline-none text-sm text-gray-700 placeholder-gray-400 h-full bg-transparent"
            />
          </div>

          {/* 清空按钮 */}
          {keywords.length > 0 && (
            <button
              onClick={clearAllKeywords}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={16} />
            </button>
          )}

          {/* +1 提示 */}
          {keywords.length > 2 && (
            <span className="ml-2 text-xs text-white bg-[#7c3aed] px-1.5 py-0.5 rounded font-medium">
              +{keywords.length - 2}
            </span>
          )}
        </div>

        {/* 复合关键词开关 */}
        <div className="flex items-center gap-2 px-4 border border-l-0 border-gray-300 bg-white">
          <button
            onClick={() => setIsComplexMode(!isComplexMode)}
            className={`w-9 h-5 rounded-full transition-colors relative ${isComplexMode ? 'bg-[#7c3aed]' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${isComplexMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-sm text-gray-600">复合关键词</span>
        </div>

        {/* 搜索按钮 */}
        <button className="h-full px-6 bg-[#5b7bf7] hover:bg-[#4a6ae6] text-white font-medium text-sm transition-colors flex items-center gap-1.5">
          <Search size={18} />
          搜索
        </button>

        {/* AI智搜按钮 */}
        <button className="h-full px-5 bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] hover:opacity-90 text-white font-medium text-sm rounded-r-md transition-opacity flex items-center gap-1.5">
          <Cpu size={18} />
          AI智搜
        </button>
      </div>

      {/* 第二行：快捷职位/公司筛选 */}
      <div className="flex items-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">职位</span>
          <div className="flex items-center">
            <div className="flex items-center border border-gray-300 rounded-l px-3 py-1.5 w-40 bg-white">
              <input
                type="text"
                value={currentJob}
                onChange={(e) => setCurrentJob(e.target.value)}
                placeholder="销售运营 运营"
                className="outline-none text-sm text-gray-700 w-full bg-transparent"
              />
            </div>
            <button className="px-2 py-1.5 border border-l-0 border-gray-300 rounded-r text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-xs bg-white flex items-center gap-0.5 h-[33px]">
              目前职位
              <ChevronDown size={12} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500">公司</span>
          <div className="flex items-center">
            <div className="flex items-center border border-gray-300 rounded-l px-3 py-1.5 w-40 bg-white">
              <input
                type="text"
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                placeholder="搜索公司"
                className="outline-none text-sm text-gray-700 w-full bg-transparent"
              />
            </div>
            <button className="px-2 py-1.5 border border-l-0 border-gray-300 rounded-r text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-xs bg-white flex items-center gap-0.5 h-[33px]">
              目前公司
              <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {/* 清除全部按钮 */}
        <button className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 ml-auto">
          <X size={14} />
          清除全部
        </button>
      </div>
    </div>
  );
};

export default SearchHeader;
