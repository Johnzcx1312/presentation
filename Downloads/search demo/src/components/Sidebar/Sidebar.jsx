import React from 'react';
import NavItem from './NavItem';
import { sidebarNavItems } from '../../data/mockData';
import { Phone, Crown } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-[200px] bg-gradient-to-b from-[#4c1d95] via-[#5b21b6] to-[#7c3aed] z-50 flex flex-col shadow-xl">
      {/* Logo区域 */}
      <div className="h-16 flex items-center px-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
            <Crown size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white tracking-wide">
              猎聘AI
            </span>
          </div>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-3">
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
