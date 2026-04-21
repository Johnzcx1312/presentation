import React from 'react';
import NavItem from './NavItem';
import { sidebarNavItems } from '../../data/mockData';
import { Sparkles, Phone } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-full w-[200px] bg-white shadow-sm z-50 flex flex-col">
      {/* Logo区域 */}
      <div className="h-16 flex items-center px-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              猎聘AI
            </span>
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
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-500">
          <Phone size={14} />
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">服务热线</span>
            <span className="text-sm font-medium">400-0620-378</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
