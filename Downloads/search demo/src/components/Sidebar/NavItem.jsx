import React from 'react';
import * as LucideIcons from 'lucide-react';
import Badge from '../common/Badge';

const NavItem = ({ icon, label, badge, isActive = false, onClick }) => {
  const IconComponent = LucideIcons[icon];
  
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-primary border-r-2 border-primary' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }
      `}
    >
      {IconComponent && <IconComponent size={20} className={isActive ? 'text-primary' : 'text-gray-500'} />}
      <span className="flex-1 text-sm font-medium">{label}</span>
      {badge && (
        <Badge variant="default" size="sm" className="min-w-[18px] h-[18px] flex items-center justify-center">
          {badge}
        </Badge>
      )}
    </div>
  );
};

export default NavItem;
