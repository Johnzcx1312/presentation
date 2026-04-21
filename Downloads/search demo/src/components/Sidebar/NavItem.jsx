import React from 'react';
import * as LucideIcons from 'lucide-react';

const NavItem = ({ icon, label, badge, isActive = false, onClick }) => {
  const IconComponent = LucideIcons[icon];
  
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 mx-2 rounded-lg
        ${isActive 
          ? 'bg-white/20 text-white shadow-inner' 
          : 'text-white/80 hover:bg-white/10 hover:text-white'
        }
      `}
    >
      {IconComponent && <IconComponent size={18} className={isActive ? 'text-white' : 'text-white/70'} />}
      <span className="flex-1 text-sm font-medium">{label}</span>
      {badge && (
        <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs rounded-full font-medium px-1.5">
          {badge}
        </span>
      )}
    </div>
  );
};

export default NavItem;
