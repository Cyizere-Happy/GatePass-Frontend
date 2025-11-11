import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Calendar,
  FileText,
  Settings,
  LogOut,
  GraduationCap
} from 'lucide-react';


interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'student-visits', label: 'Student Visits', icon: CalendarCheck },
    { id: 'verification', label: 'Verification', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'visiting-days', label: 'Visiting Days', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col justify-between relative overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#153d5d]">Gate<span className='text-black' style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>Pass.</span></h1>
        <p className="text-xs text-gray-500 mt-1">School Dashboard</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#deeefa]/100 text-[#153d5d] font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#153d5d]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

     

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 z-10 bg-white">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
