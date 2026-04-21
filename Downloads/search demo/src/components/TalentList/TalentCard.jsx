import React from 'react';
import Button from '../common/Button';
import { User, Briefcase, Clock, MapPin, GraduationCap, Zap, MessageCircle } from 'lucide-react';

const TalentCard = ({ talent }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 hover:border-purple-200">
      <div className="flex gap-4">
        {/* 左侧：头像和状态 */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
              {talent.gender === 'female' ? (
                <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center">
                  <User size={28} className="text-pink-400" />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <User size={28} className="text-blue-400" />
                </div>
              )}
            </div>
            
            {/* 在线状态 */}
            {talent.isOnline && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          
          {/* 活跃状态 */}
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-400">{talent.status}</span>
          </div>
        </div>

        {/* 中间：基本信息 */}
        <div className="flex-1 min-w-0">
          {/* 姓名和基本信息行 */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{talent.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{talent.age}岁</span>
              <span className="text-gray-300">|</span>
              <span>{talent.experience}</span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <GraduationCap size={14} />
                {talent.education}
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {talent.city}
              </span>
            </div>
          </div>

          {/* 期望职位 */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-500">期望:</span>
            <span className="text-gray-700">{talent.expectCity}</span>
            <span className="text-gray-900 font-medium">{talent.expectPosition}</span>
            <span className="text-primary font-semibold">{talent.salary}</span>
          </div>

          {/* 标签 */}
          <div className="flex items-center gap-2 mb-4">
            {talent.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded border border-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 工作经历时间线 */}
          <div className="space-y-2">
            {talent.workExperience.slice(0, 4).map((work, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Briefcase size={14} className="text-gray-400" />
                  <span className="font-medium">{work.company}</span>
                  <span className="text-gray-500">{work.position}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs ml-auto">
                  <Clock size={12} />
                  <span>{work.period}</span>
                  <span className="text-gray-300">({work.duration})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex-shrink-0 flex flex-col gap-2">
          <Button variant="primary" size="sm" className="whitespace-nowrap">
            <MessageCircle size={14} className="mr-1" />
            立即沟通
          </Button>
          <Button variant="ghost" size="sm" className="whitespace-nowrap text-xs">
            <Zap size={14} className="mr-1" />
            AI智能分析
          </Button>
        </div>
      </div>

      {/* 底部复选框 */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="text-sm text-gray-500">选择</span>
        </label>
      </div>
    </div>
  );
};

export default TalentCard;
