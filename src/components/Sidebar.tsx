import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'student-visits', label: 'Student Visits', icon: CalendarCheck },
    { id: 'verification', label: 'Verification', icon: Users },
    { id: 'outside-visitors', label: 'Outside Visitors', icon: Users },
    { id: 'visiting-days', label: 'Visiting Days', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 ease-in-out relative group ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-9 z-50 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center">
        {!collapsed ? (
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#153d5d] tracking-tight">
              Gate<span className="text-black font-black" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>Pass.</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-medium">School Gate Management</p>
          </div>
        ) : (
          <div className="mx-auto">
            <div className="text-2xl font-black text-[#153d5d] tracking-tighter">G<span className='text-black font-black'>P.</span></div>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <div key={item.id} className="relative">
              <button
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors duration-300 group relative
                  ${isActive
                    ? 'bg-blue-100 text-[#153d5d] font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#153d5d]'
                  } ${collapsed ? 'justify-center' : 'justify-start'}`}
              >
                <div className={`flex items-center ${collapsed ? '' : 'gap-4'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#153d5d]' : 'text-current'} transition-colors`} />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </div>

                {/* Active Indicator */}
                {isActive && !collapsed && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-300 rounded-r-full transition-all duration-300" />
                )}
              </button>

              {/* Tooltip when collapsed */}
              {collapsed && hoveredItem === item.id && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-8 border-transparent border-r-gray-900" />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* Logout */}
        <div className="relative">
          <button
            onClick={() => onNavigate('logout')}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-300 group
              ${collapsed ? 'justify-center' : 'justify-start'}`}
          >
            <LogOut className="w-5 h-5 transition-colors duration-300 group-hover:scale-110" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>

          {collapsed && hoveredItem === 'logout' && (
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50">
              Logout
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-8 border-transparent border-r-red-600" />
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        {!collapsed && (
          <div className="flex justify-center gap-2 pt-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium">
              <Sun className="w-4 h-4" /> Light
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition-colors text-sm font-medium">
              <Moon className="w-4 h-4" /> Dark
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
