import React from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import SearchHeader from './components/SearchHeader/SearchHeader';
import FilterSection from './components/FilterSection/FilterSection';
import TalentList from './components/TalentList/TalentList';

function App() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* 侧边栏 - 固定定位 */}
      <Sidebar />

      {/* 主内容区 */}
      <main className="ml-[200px] p-4">
        {/* 顶部导航栏（模拟） */}
        <div className="h-14 bg-white rounded-lg shadow-sm mb-4 flex items-center px-4">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-700 font-medium">搜索人才</span>
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-gray-500">招聘数据</span>
              <span className="text-gray-500">VIP</span>
              <span className="text-gray-500">我的权益</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">赵</span>
                </div>
                <span className="text-gray-700 text-sm">赵呈祥</span>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索区域 */}
        <SearchHeader />

        {/* 筛选区域 */}
        <FilterSection />

        {/* 人才列表区域 */}
        <TalentList />
      </main>
    </div>
  );
}

export default App;
