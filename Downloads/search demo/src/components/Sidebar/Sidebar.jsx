import React from 'react';
import { 
  UserCircle, 
  Briefcase, 
  Search, 
  MessageSquare, 
  Users, 
  Target,
  BarChart3,
  Phone
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: UserCircle, label: '人才推荐', active: false },
    { icon: Briefcase, label: '职位管理', active: false },
    { icon: Search, label: '搜索人才', active: true },
    { icon: MessageSquare, label: '沟通', active: false, badge: 13 },
    { icon: Users, label: '人才管理', active: false },
    { icon: Target, label: '猎头服务', active: false },
    { icon: BarChart3, label: '提效服务', active: false },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[180px] bg-[#3d1f72] flex flex-col z-50">
      {/* Logo区域 */}
      <div className="h-14 flex items-center px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">猎</span>
          </div>
          <span className="text-white font-bold text-lg">猎聘AI</span>
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all ${
                item.active
                  ? 'bg-[#7c3aed] text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="relative">
                <Icon size={18} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* 底部服务热线 */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-white/50">
          <Phone size={14} />
          <div className="text-xs">
            <div>服务热线</div>
            <div className="text-white/30">400-0602-378</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
