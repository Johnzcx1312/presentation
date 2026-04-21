import React from 'react';
import NavItem from './NavItem';
import { sidebarNavItems } from '../../data/mockData';
import { Phone } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-[200px] bg-gradient-to-b from-[#5b21b6] to-[#7c3aed] z-50 flex flex-col shadow-xl">
      {/* Logo区域 */}
      <div className="h-14 flex items-center px-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          {/* 猎字图标 */}
          <div className="w-7 h-7 bg-white/20 rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">猎</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-white tracking-tight">
              猎聘AI
            </span>
            <span className="text-xs text-white/60">搜索人才</span>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-2">
        {sidebarNavItems.map((item, index) => (
          <NavItem
            key={index}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            isActive={item.isActive}
          />
        ))}
      </nav>

      {/* 底部服务热线 */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-white/70">
          <Phone size={14} />
          <div className="flex flex-col">
            <span className="text-xs text-white/50">服务热线</span>
            <span className="text-sm font-medium text-white">400-0620-378</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
