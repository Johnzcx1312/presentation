import React from 'react';
import { MessageCircle, Sparkles, Check } from 'lucide-react';

const TalentCard = ({ talent, viewMode = 'card', isSelected = false, onSelect }) => {
  // 安全获取字段
  const {
    id,
    name = '未知',
    gender = 'male',
    isOnline = false,
    status = '',
    age = 28,
    experience = '3年',
    education = '本科',
    city = '北京',
    expectCity = '北京',
    expectPosition = '工程师',
    salary = '面议',
    company = '',
    tags = [],
    workExperience = [],
  } = talent || {};

  const safeTags = Array.isArray(tags) ? tags : [];
  const safeWorkExp = Array.isArray(workExperience) ? workExperience : [];

  return (
    <div 
      onClick={onSelect}
      className={`relative bg-white p-5 hover:bg-[#fafafa] transition-all duration-200 border-b border-gray-100 last:border-b-0 cursor-pointer group ${
        isSelected ? 'bg-[#f5f3ff]/50' : ''
      }`}
    >
      {/* 左侧选中指示条 */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-200 ${
        isSelected ? 'bg-[#7c3aed]' : 'bg-transparent group-hover:bg-[#7c3aed]/30'
      }`} />

      {/* 选中状态 checkbox */}
      <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 ${
        isSelected || true ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          isSelected 
            ? 'bg-[#7c3aed] border-[#7c3aed]' 
            : 'border-gray-300 bg-white group-hover:border-[#7c3aed]'
        }`}>
          {isSelected && <Check size={12} className="text-white" />}
        </div>
      </div>

      <div className="flex gap-4 pl-8">
        {/* 左侧：头像 */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&gender=${gender}`}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          
          {/* 活跃状态 */}
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-400">{status || (isOnline ? '3天内活跃' : '')}</span>
          </div>
        </div>

        {/* 中间：信息区 */}
        <div className="flex-1 min-w-0">
          {/* 第一行：姓名和基本信息 */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-900">{name}</h3>
            <span className="text-sm text-gray-600">{age}岁</span>
            <span className="text-sm text-gray-600">{experience}</span>
            <span className="text-sm text-gray-600">{education}</span>
            <span className="text-sm text-gray-600">{city}</span>
            {isOnline && (
              <span className="text-xs text-green-600 font-medium">在线</span>
            )}
          </div>

          {/* 第二行：期望 */}
          <div className="flex items-center gap-2 mb-2 text-sm">
            <span className="text-gray-500">期望:</span>
            <span className="text-gray-700">{expectCity}</span>
            <span className="font-medium text-gray-900">{expectPosition}</span>
            <span className="text-[#f59e0b] font-semibold">{salary}</span>
          </div>

          {/* 第三行：标签 */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {safeTags.slice(0, 5).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
            <span className="px-2 py-0.5 text-xs bg-[#f5f3ff] text-[#7c3aed] rounded flex items-center gap-1">
              <Sparkles size={10} />
              互联网
            </span>
          </div>

          {/* 工作经历 */}
          <div className="space-y-1.5">
            {safeWorkExp.slice(0, 3).map((work, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                <span className="font-medium text-gray-700">{work?.company || '-'}</span>
                <span className="text-[#7c3aed]">{work?.position || '-'}</span>
                <span className="text-gray-400 text-xs ml-auto">{work?.period || ''}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：操作区 */}
        <div className="flex-shrink-0 flex flex-col gap-2 items-end">
          <button 
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5b4ddb] hover:bg-[#4a3fc7] text-white text-sm rounded-md transition-colors"
          >
            <MessageCircle size={14} />
            立即沟通
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-[#5b4ddb] hover:bg-[#f5f3ff] text-sm rounded-md transition-colors"
          >
            <Sparkles size={14} />
            AI 智能分析
          </button>
        </div>
      </div>
    </div>
  );
};

export default TalentCard;
