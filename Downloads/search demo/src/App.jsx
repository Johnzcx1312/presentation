import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import SearchHeader from './components/SearchHeader/SearchHeader';
import FilterSection from './components/FilterSection/FilterSection';
import TalentList from './components/TalentList/TalentList';
import { Bell, Crown } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#f8f7fc]">
      {/* 侧边栏 - 固定定位 */}
      <Sidebar />

      {/* 主内容区 */}
      <main className="ml-[200px]">
        {/* 顶部全局导航栏 */}
        <header className="h-14 bg-white shadow-sm flex items-center px-6 sticky top-0 z-40">
          {/* 左侧面包屑/标题 */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-800 font-medium">搜索人才</span>
          </div>

          {/* 右侧功能区 */}
          <div className="flex items-center gap-6 ml-auto">
            {/* Banner区域 - 招聘福利 */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-100 to-yellow-50 rounded-full border border-orange-200">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-orange-600">招聘福利</span>
                <span className="text-xs text-orange-500">点击领取</span>
              </div>
            </div>

            {/* 通知图标 */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* 招聘数据 */}
            <button className="text-sm text-gray-600 hover:text-gray-900">
              招聘数据
            </button>

            {/* VIP标识 */}
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded text-white text-xs font-bold">
              <Crown size={12} />
              VIP
            </div>

            {/* 我的权益 */}
            <button className="text-sm text-gray-600 hover:text-gray-900">
              我的权益
            </button>

            {/* 用户信息 */}
            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-[#7c3aed] to-[#a855f7] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">赵</span>
              </div>
              <span className="text-gray-700 text-sm">赵呈祥</span>
              <span className="text-gray-400 text-xs">▼</span>
            </div>
          </div>
        </header>

        {/* 主内容区域 */}
        <div className="p-5">
          {/* 搜索区域 */}
          <SearchHeader />

          {/* 筛选区域 */}
          <FilterSection />

          {/* 人才列表区域 */}
          <TalentList />
        </div>
      </main>
    </div>
  );
}

export default App;
