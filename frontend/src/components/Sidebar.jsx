import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Calendar,
    CreditCard,
    MessageSquare,
    Settings,
    LogOut,
    X,
    ClipboardList,
    PieChart,
    TrendingUp
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ className, onClose }) => {
    const { user, logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Employee', 'Manager', 'Admin'] },
        { name: 'Team', path: '/team', icon: Users, roles: ['Manager', 'Admin'] },
        { name: 'Performance', path: '/performance', icon: TrendingUp, roles: ['Employee', 'Manager', 'Admin'] },
        { name: 'Leaves', path: '/leaves', icon: Calendar, roles: ['Employee', 'Manager', 'Admin'] },
        { name: 'Tasks', path: '/tasks', icon: ClipboardList, roles: ['Employee', 'Manager', 'Admin'] },
        { name: 'Payroll', path: '/payroll', icon: CreditCard, roles: ['Admin', 'Manager', 'Employee'] },
        { name: 'Reports', path: '/reports', icon: PieChart, roles: ['Admin', 'Manager'] },
        { name: 'Chat', path: '/chat', icon: MessageSquare, roles: ['Employee', 'Manager', 'Admin'] },
        { name: 'Settings', path: '/settings', icon: Settings, roles: ['Admin'] },
    ];

    // Filter menu items by role
    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role || 'Employee'));

    return (
        <div className={clsx("glass-panel m-4 flex flex-col h-[calc(100vh-2rem)]", className)}>
            <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl">
                        T
                    </div>
                    <span className="text-xl font-bold text-white tracking-wide truncate w-40">Trinix<span className="text-indigo-400">IT</span></span>
                </div>

                {/* Mobile close button */}
                {onClose && (
                    <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                <nav className="space-y-2 px-4">
                    {filteredItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                                    isActive
                                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                                        : "text-slate-400 hover:bg-slate-700/30 hover:text-slate-200"
                                )
                            }
                        >
                            <item.icon size={20} className={clsx("transition-transform duration-300")} />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="p-4 mt-auto">
                <div className="glass-card p-4 rounded-xl mb-4 bg-slate-800/80 border border-slate-700/50 flex items-center gap-3">
                    <img
                        src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff`}
                        alt="Profile"
                        className="w-10 h-10 rounded-lg object-cover border border-indigo-500/30"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-indigo-400 truncate">{user?.role}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
