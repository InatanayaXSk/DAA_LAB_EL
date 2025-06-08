import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  GraduationCap,
  Calendar,
  ClipboardList,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const getNavigationItems = () => {
    const commonItems = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ];

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { name: 'Schedule Exams', href: '/schedule-exams', icon: Calendar },
        { name: 'Manage Classrooms', href: '/classrooms', icon: Building2 },
        { name: 'Seating Arrangements', href: '/seating', icon: Users },
        { name: 'Faculty Availability', href: '/faculty-availability', icon: UserCheck },
        { name: 'Complaints', href: '/complaints', icon: MessageSquare },
        { name: 'Leave Requests', href: '/leave-requests', icon: ClipboardList },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    } else if (user?.role === 'faculty') {
      return [
        ...commonItems,
        { name: 'My Availability', href: '/availability', icon: UserCheck },
        { name: 'Raise Complaint', href: '/raise-complaint', icon: MessageSquare },
        { name: 'My Complaints', href: '/my-complaints', icon: FileText },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    } else {
      return [
        ...commonItems,
        { name: 'Submit Leave Request', href: '/submit-leave', icon: ClipboardList },
        { name: 'My Leave Requests', href: '/my-leave-requests', icon: FileText },
        { name: 'Complaints Against Me', href: '/my-complaints', icon: MessageSquare },
        { name: 'Settings', href: '/settings', icon: Settings },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">ExamHub</h1>
          <p className="text-xs text-gray-500 capitalize">{user?.role} Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;