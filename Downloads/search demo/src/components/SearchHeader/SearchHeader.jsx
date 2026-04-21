import React, { useState } from 'react';
import { Search, Cpu, ChevronDown, X, Plus, XCircle } from 'lucide-react';

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
      {/* 主搜索栏 - 类似猎聘的大搜索框 */}
      <div className="flex items-stretch gap-0">
        {/* 职位选择下拉 */}
        <div className="relative">
          <button
            onClick={() => setShowPositionDropdown(!showPositionDropdown)}
            className="h-12 px-4 bg-white border border-r-0 border-gray-300 rounded-l-lg hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2 min-w-[100px]"
          >
            {position}
            <ChevronDown size={16} className={`transition-transform ${showPositionDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showPositionDropdown && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
              {positions.map((pos) => (
                <div
                  key={pos}
                  onClick={() => { setPosition(pos); setShowPositionDropdown(false); }}
                  className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${position === pos ? 'text-[#5b21b6] bg-purple-50 font-medium' : 'text-gray-700'}`}
                >
                  {pos}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 关键词输入区 - 大输入框 */}
        <div className="flex-1 flex items-center border border-gray-300 bg-white px-4 h-12">
          <div className="flex items-center gap-2 flex-wrap flex-1">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f3f0ff] text-[#5b21b6] text-sm rounded-md border border-[#ddd6fe] font-medium"
              >
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(index)}
                  className="hover:text-[#4c1d95] transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={keywords.length === 0 ? "请输入关键词，如：Java、产品经理、运营" : ""}
              className="flex-1 min-w-[200px] outline-none text-sm text-gray-700 placeholder-gray-400 h-full"
            />
          </div>

          {/* 清空按钮 */}
          {keywords.length > 0 && (
            <button
              onClick={clearAllKeywords}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="清空关键词"
            >
              <XCircle size={18} />
            </button>
          )}

          {/* +1 提示 */}
          {keywords.length > 2 && (
            <span className="ml-2 text-xs text-white bg-[#7c3aed] px-2 py-0.5 rounded-full font-medium">
              +{keywords.length - 2}
            </span>
          )}
        </div>

        {/* 复合关键词开关 */}
        <div className="flex items-center gap-3 px-4 border border-l-0 border-gray-300 bg-white h-12">
          <button
            onClick={() => setIsComplexMode(!isComplexMode)}
            className={`w-11 h-6 rounded-full transition-colors relative ${isComplexMode ? 'bg-[#7c3aed]' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isComplexMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-sm text-gray-600 whitespace-nowrap">复合关键词</span>
        </div>

        {/* 搜索按钮 - 蓝色主按钮 */}
        <button className="h-12 px-8 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-medium text-base transition-colors flex items-center gap-2">
          <Search size={20} />
          搜索
        </button>

        {/* AI智搜按钮 - 紫色渐变 */}
        <button className="h-12 px-6 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:opacity-90 text-white font-medium text-base rounded-r-lg transition-opacity flex items-center gap-2">
          <Cpu size={20} />
          AI智搜
        </button>
      </div>

      {/* 第二行：快捷职位/公司筛选 */}
      <div className="flex items-center gap-6 mt-4 text-sm">
        {/* 职位筛选 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">职位</span>
          <div className="flex items-center">
            <div className="flex items-center border border-gray-300 rounded-l px-3 py-2 w-44 bg-white">
              <input
                type="text"
                value={currentJob}
                onChange={(e) => setCurrentJob(e.target.value)}
                placeholder="销售运营 运营"
                className="outline-none text-sm text-gray-700 w-full bg-transparent"
              />
            </div>
            <button className="px-3 py-2 border border-l-0 border-gray-300 rounded-r text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-xs bg-white">
              <div className="flex items-center gap-1">
                目前职位
                <ChevronDown size={14} />
              </div>
            </button>
          </div>
        </div>

        {/* 公司筛选 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">公司</span>
          <div className="flex items-center">
            <div className="flex items-center border border-gray-300 rounded-l px-3 py-2 w-44 bg-white">
              <input
                type="text"
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                placeholder="搜索公司"
                className="outline-none text-sm text-gray-700 w-full bg-transparent"
              />
            </div>
            <button className="px-3 py-2 border border-l-0 border-gray-300 rounded-r text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-xs bg-white">
              <div className="flex items-center gap-1">
                目前公司
                <ChevronDown size={14} />
              </div>
            </button>
          </div>
        </div>

        {/* 清除全部按钮 */}
        <button className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 ml-auto">
          <X size={16} />
          清除全部
        </button>
      </div>
    </div>
  );
};

export default SearchHeader;
