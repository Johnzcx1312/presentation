import React, { useState } from 'react';
import { Search, Cpu, ChevronDown, Sparkles, SlidersHorizontal, Mic, History } from 'lucide-react';

const AISearchHeader = ({ onToggleAdvancedFilters, showAdvancedFilters }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // 已发布的职位列表
  const publishedPositions = [
    { id: 1, title: '高级Java工程师', department: '技术部', location: '北京' },
    { id: 2, title: '产品经理', department: '产品部', location: '上海' },
    { id: 3, title: '运营专员', department: '运营部', location: '北京' },
    { id: 4, title: 'UI设计师', department: '设计部', location: '深圳' },
    { id: 5, title: '数据分析师', department: '数据部', location: '北京' },
  ];

  // 搜索历史
  const searchHistory = [
    '3-5年经验的Java开发，会微服务',
    '本科以上学历，有互联网大厂背景的产品经理',
    '北京地区的运营，薪资20-30K',
    '5年以上经验的技术总监，管理过团队',
  ];

  const handlePositionSelect = (position) => {
    setSelectedPosition(position);
    setShowPositionDropdown(false);
    // 自动生成搜索文本
    setSearchText(`帮我找一位${position.title}，要求有相关工作经验`);
  };

  const handleSearch = () => {
    // 触发AI搜索
    console.log('AI搜索:', searchText);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // 模拟语音识别
    setTimeout(() => {
      setIsListening(false);
      setSearchText(prev => prev + '，会Spring Boot和微服务架构');
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
      {/* 标题区 */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-[#7c3aed] to-[#a855f7] rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
          <Sparkles size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">AI智能人才搜索</h2>
          <p className="text-sm text-gray-500">用自然语言描述你需要的人才，AI自动理解并搜索</p>
        </div>
      </div>

      {/* 主搜索区 - 大输入框 */}
      <div className="relative">
        {/* 职位选择下拉 */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <button
              onClick={() => setShowPositionDropdown(!showPositionDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-[#7c3aed] hover:text-[#7c3aed] transition-colors shadow-sm"
            >
              <span className="font-medium">
                {selectedPosition ? selectedPosition.title : '选择已发布职位'}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showPositionDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showPositionDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">已发布的职位</span>
                </div>
                {publishedPositions.map((pos) => (
                  <div
                    key={pos.id}
                    onClick={() => handlePositionSelect(pos)}
                    className="px-4 py-3 cursor-pointer hover:bg-[#f5f3ff] border-b border-gray-50 last:border-0 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{pos.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{pos.department} · {pos.location}</div>
                      </div>
                      {selectedPosition?.id === pos.id && (
                        <div className="w-2 h-2 bg-[#7c3aed] rounded-full" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 大文本输入框 */}
        <div className="flex items-center">
          <div className="flex-1">
            <textarea
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="例如：帮我找3-5年经验的Java工程师，本科以上学历，熟悉微服务架构，base在北京，薪资25-35K..."
              className="w-full pl-48 pr-32 py-5 text-base text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl resize-none focus:border-[#7c3aed] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400"
              rows={3}
            />
          </div>

          {/* 右侧操作按钮 */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {/* AI搜索按钮 */}
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-200"
            >
              <Cpu size={20} />
              <span>AI搜索</span>
            </button>

            {/* 语音输入按钮 */}
            <button
              onClick={handleVoiceInput}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isListening
                  ? 'bg-red-50 text-red-600 animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mic size={16} className={isListening ? 'animate-bounce' : ''} />
              <span>{isListening ? '正在聆听...' : '语音输入'}</span>
            </button>
          </div>
        </div>

        {/* 历史记录下拉 */}
        {showHistory && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">搜索历史</span>
              <button className="text-xs text-[#7c3aed] hover:underline">清空</button>
            </div>
            {searchHistory.map((item, index) => (
              <div
                key={index}
                onClick={() => { setSearchText(item); setShowHistory(false); }}
                className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-50 last:border-0 flex items-center gap-3"
              >
                <History size={16} className="text-gray-400" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 快捷提示标签 */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <span className="text-xs text-gray-500">你可以这样问：</span>
        {[
          '3年经验的Java开发',
          '本科以上学历',
          '25-35K薪资',
          '北京地区',
          '大厂背景'
        ].map((tip, index) => (
          <button
            key={index}
            onClick={() => setSearchText(prev => prev ? prev + '，' + tip : tip)}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-[#f5f3ff] hover:text-[#7c3aed] transition-colors"
          >
            + {tip}
          </button>
        ))}
      </div>

      {/* 底部工具栏 */}
      <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
        <div className="flex items-center gap-4">
          {/* 展开高级筛选按钮 */}
          <button
            onClick={onToggleAdvancedFilters}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showAdvancedFilters
                ? 'bg-[#f5f3ff] text-[#7c3aed]'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal size={16} />
            <span>{showAdvancedFilters ? '收起高级筛选' : '展开高级筛选'}</span>
            <ChevronDown size={14} className={`transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* 历史记录按钮 */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showHistory
                ? 'bg-[#f5f3ff] text-[#7c3aed]'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <History size={16} />
            <span>历史记录</span>
          </button>
        </div>

        {/* 右侧统计信息 */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>AI已理解 <strong className="text-[#7c3aed]">5</strong> 个维度</span>
          <span>•</span>
          <span>找到 <strong className="text-[#7c3aed]">128</strong> 位匹配人才</span>
        </div>
      </div>
    </div>
  );
};

export default AISearchHeader;
