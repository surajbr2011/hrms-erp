import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user) return;
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            socket.emit('join_room', 'general');
            socket.emit('join_room', 'engineering');
            socket.emit('join_room', 'design');
            socket.emit('join_room', 'announcements');
            socket.emit('join_room', user._id);
        });

        socket.on('receive_message', (data) => {
            if (location.pathname.includes('/chat')) return;
            if (data.senderId === user._id) return;
            
            setNotifications(prev => [...prev, data]);
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== data.id));
            }, 5000);
        });

        return () => socket.close();
    }, [user, location.pathname]);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar for desktop */}
            <div className="hidden lg:block w-72 flex-shrink-0">
                <Sidebar className="h-full" />
            </div>

            {/* Mobile sidebar placeholder & backdrop overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <Sidebar className="h-full" onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 w-full overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
                    <Outlet />
                </main>
            </div>

            {/* Global Chat Notifications */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {notifications.map(n => (
                    <div key={n.id} className="bg-slate-800 border border-slate-700/50 shadow-2xl p-4 rounded-xl max-w-sm w-72 flex items-start gap-3 animate-in slide-in-from-right-10 fade-in duration-300">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                            <MessageSquare size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-sm font-semibold text-white truncate">{n.senderName} <span className="text-xs text-slate-400 font-normal">in #{n.room}</span></h4>
                                <button onClick={() => setNotifications(prev => prev.filter(msg => msg.id !== n.id))} className="text-slate-500 hover:text-white transition-colors">
                                    <X size={14} />
                                </button>
                            </div>
                            <p className="text-sm text-slate-300 truncate">{n.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainLayout;
