import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ClipboardList, 
  BarChart3, 
  LogOut, 
  Bell, 
  Stethoscope
} from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'staff', 'technician'] },
    { label: 'Complaints', icon: ClipboardList, path: '/dashboard', roles: ['admin', 'staff', 'technician'] },
    { label: 'Monitoring', icon: BarChart3, path: '/monitoring', roles: ['admin'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">CAREBRIDGES</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {filteredNav.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-primary-600 transition-all font-medium"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-all font-medium"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-semibold text-slate-800 lg:hidden">CAREBRIDGES</h2>
          <div className="flex-1 hidden lg:block" />
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold border-2 border-primary-50">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
