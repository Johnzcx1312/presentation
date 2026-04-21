import React from 'react';
import { User, MessageCircle, Sparkles } from 'lucide-react';

const TalentCard = ({ talent }) => {
  return (
    <div className="bg-white p-5 hover:bg-[#fafafa] transition-colors duration-200 border-b border-gray-100 last:border-b-0">
      <div className="flex gap-5">
        {/* 左侧：头像和状态 */}
        <div className="flex-shrink-0">
          <div className="relative">
            {/* 头像框 - 真实照片风格 */}
            <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-md">
              {talent.gender === 'female' ? (
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${talent.name}&gender=female`}
                  alt={talent.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${talent.name}&gender=male`}
                  alt={talent.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {/* 在线状态指示器 */}
            {talent.isOnline && (
              <span className="absolute bottom-1 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />
            )}
          </div>
          
          {/* 活跃状态标签 */}
          <div className="mt-2 text-center">
            <span className={`
              text-xs px-2 py-0.5 rounded-full font-medium
              ${talent.isOnline 
                ? 'bg-green-100 text-green-600' 
                : 'text-gray-400'
              }
            `}>
              {talent.status}
            </span>
          </div>
        </div>

        {/* 中间：基本信息 */}
        <div className="flex-1 min-w-0">
          {/* 第一行：姓名和基本信息 */}
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-base font-bold text-gray-900">{talent.name}</h3>
            {talent.isOnline && (
              <span className="text-xs text-green-600 font-medium">在线</span>
            )}
          </div>

          {/* 第二行：基本信息标签 */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>{talent.age}岁</span>
            <span className="text-gray-300">|</span>
            <span>{talent.experience}</span>
            <span className="text-gray-300">|</span>
            <span>{talent.education}</span>
            <span className="text-gray-300">|</span>
            <span>{talent.city}</span>
          </div>

          {/* 第三行：期望职位和薪资 */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-gray-500">期望:</span>
            <span className="text-sm text-gray-700">{talent.expectCity}</span>
            <span className="text-sm text-gray-900 font-medium">{talent.expectPosition}</span>
            <span className="text-sm text-[#f59e0b] font-semibold">{talent.salary}</span>
          </div>

          {/* 第四行：技能标签 */}
          <div className="flex items-center gap-2 mb-4">
            {talent.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2.5 py-1 text-xs bg-[#f3f0ff] text-[#5b21b6] rounded-md font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 工作经历时间线 */}
          <div className="space-y-2">
            {talent.workExperience.slice(0, 4).map((work, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">•</span>
                  <span className="font-medium text-gray-800">{work.company}</span>
                  <span className="text-gray-500">{work.position}</span>
                </div>
                <div className="text-gray-400 text-xs">
                  {work.period} ({work.duration})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex-shrink-0 flex flex-col gap-2 items-end">
          {/* 立即沟通按钮 */}
          <button className="flex items-center gap-1.5 px-5 py-2 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
            <MessageCircle size={16} />
            立即沟通
          </button>
          
          {/* AI智能分析按钮 */}
          <button className="flex items-center gap-1.5 px-5 py-2 text-[#7c3aed] hover:bg-[#f3f0ff] text-sm font-medium rounded-lg transition-colors">
            <Sparkles size={16} />
            AI智能分析
          </button>
        </div>
      </div>
    </div>
  );
};

export default TalentCard;
