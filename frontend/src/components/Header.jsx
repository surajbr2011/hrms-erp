import { Bell, Menu, Search, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-4 md:px-6 lg:px-8 glass-panel m-4 mt-4 bg-slate-800/60 shadow-md backdrop-blur-md rounded-2xl border border-indigo-500/20">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-xl bg-slate-700/50 text-slate-300 hover:text-white"
                >
                    <Menu size={24} />
                </button>

                <div className="hidden md:flex items-center pt-1">
                    <h2 className="text-xl font-semibold text-white tracking-wide">
                        Welcome back, <span className="text-indigo-400">{user?.name?.split(' ')[0] || 'User'}</span> 👋
                    </h2>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-48 lg:w-64 transition-all text-white placeholder-slate-500"
                    />
                </div>

                <button className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/50 shadow-sm">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-800"></span>
                </button>

                <Link to="/profile">
                    <button className="flex items-center justify-center p-2 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 hover:text-indigo-200 transition-colors border border-indigo-500/20 shadow-sm">
                        <UserIcon size={20} />
                    </button>
                </Link>
            </div>
        </header>
    );
};

export default Header;
