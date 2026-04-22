import React from 'react';
import * as LucideIcons from 'lucide-react';

const NavItem = ({ icon, label, badge, isActive = false, onClick }) => {
  const IconComponent = LucideIcons[icon];
  
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-200 mx-2 rounded-md
        ${isActive 
          ? 'bg-white/15 text-white' 
          : 'text-white/80 hover:bg-white/10 hover:text-white'
        }
      `}
    >
      {IconComponent && <IconComponent size={18} className={isActive ? 'text-white' : 'text-white/70'} />}
      <span className="flex-1 text-sm font-medium">{label}</span>
      {badge && (
        <span className="min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full font-medium px-1.5">
          {badge}
        </span>
      )}
    </div>
  );
};

export default NavItem;
