import { Bell, Menu, Search, User as UserIcon, X, CheckCheck, Trash2 } from 'lucide-react';
import { useAuth, api } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';

const TYPE_COLORS = {
    Task: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    Leave: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    Announcement: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    Attendance: 'bg-green-500/20 text-green-300 border-green-500/30',
    System: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};

const TYPE_ICONS = {
    Task: '📋',
    Leave: '🗓️',
    Announcement: '📢',
    Attendance: '⏱️',
    System: '⚙️',
};

const timeAgo = (date) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
};

const Header = ({ onMenuClick }) => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const panelRef = useRef(null);
    const bellRef = useRef(null);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const { data } = await api.get('/notifications/unread-count');
            setUnreadCount(data.count);
        } catch { /* silently fail */ }
    }, []);

    const fetchNotifications = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
        } catch { /* silently fail */ }
        setLoading(false);
    }, []);

    // Poll unread count every 30 seconds
    useEffect(() => {
        if (!user) return;
        
        const fetchInitialCount = async () => {
            await fetchUnreadCount();
        };
        fetchInitialCount();
        
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [user, fetchUnreadCount]);

    // Open panel → load notifications
    useEffect(() => {
        const fetchPanel = async () => {
            if (open) await fetchNotifications();
        };
        fetchPanel();
    }, [open, fetchNotifications]);

    // Close panel on outside click
    useEffect(() => {
        const handler = (e) => {
            if (
                panelRef.current && !panelRef.current.contains(e.target) &&
                bellRef.current && !bellRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch { /* silently fail */ }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch { /* silently fail */ }
    };

    const handleDelete = async (id) => {
        const notif = notifications.find(n => n._id === id);
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
            if (!notif?.isRead) setUnreadCount(prev => Math.max(0, prev - 1));
        } catch { /* silently fail */ }
    };


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

                {/* ─── Bell Button ─────────────────────────────────── */}
                <div className="relative">
                    <button
                        ref={bellRef}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpen((prev) => !prev);
                        }}
                        className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/50 shadow-sm"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-800 animate-pulse">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* ─── Notification Panel ───────────────────────── */}
                    {open && (
                        <div
                            ref={panelRef}
                            className="absolute right-0 mt-2 w-[360px] max-w-[95vw] bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn"
                            style={{ animation: 'slideDown 0.18s ease-out' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/60 bg-slate-800/80">
                                <div className="flex items-center gap-2">
                                    <Bell size={16} className="text-indigo-400" />
                                    <span className="text-white font-semibold text-sm">Notifications</span>
                                    {unreadCount > 0 && (
                                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleMarkAllRead}
                                            title="Mark all as read"
                                            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            <CheckCheck size={14} />
                                            <span className="hidden sm:inline">All read</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-800">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12 text-slate-400 text-sm gap-2">
                                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                        Loading...
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="py-14 text-center">
                                        <div className="text-4xl mb-2">🔔</div>
                                        <p className="text-slate-400 text-sm">You're all caught up!</p>
                                        <p className="text-slate-600 text-xs mt-1">No notifications yet</p>
                                    </div>
                                ) : (
                                    notifications.map(n => (
                                        <div
                                            key={n._id}
                                            className={`flex gap-3 px-4 py-3 group transition-colors ${n.isRead ? 'bg-transparent hover:bg-slate-800/40' : 'bg-indigo-500/5 hover:bg-indigo-500/10'}`}
                                        >
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-base border ${TYPE_COLORS[n.type] || TYPE_COLORS.System}`}>
                                                {TYPE_ICONS[n.type] || '🔔'}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-sm font-medium truncate ${n.isRead ? 'text-slate-300' : 'text-white'}`}>
                                                        {n.title}
                                                    </p>
                                                    {!n.isRead && (
                                                        <span className="flex-shrink-0 w-2 h-2 bg-indigo-400 rounded-full mt-1.5" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                                                <p className="text-[10px] text-slate-600 mt-1">{timeAgo(n.createdAt)}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex-shrink-0 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!n.isRead && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(n._id)}
                                                        title="Mark as read"
                                                        className="p-1 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-indigo-400 transition-colors"
                                                    >
                                                        <CheckCheck size={13} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(n._id)}
                                                    title="Delete"
                                                    className="p-1 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="px-4 py-2.5 border-t border-slate-700/60 bg-slate-800/50 text-center">
                                    <p className="text-xs text-slate-500">
                                        Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <Link to="/profile">
                    <button className="flex items-center justify-center p-2 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 hover:text-indigo-200 transition-colors border border-indigo-500/20 shadow-sm">
                        <UserIcon size={20} />
                    </button>
                </Link>
            </div>

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)    scale(1);    }
                }
            `}</style>
        </header>
    );
};

export default Header;
