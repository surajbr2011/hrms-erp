import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Target, Clock, MessageSquare, Paperclip, CheckCircle2, MoreVertical, Plus } from 'lucide-react';

const Tasks = () => {
    const { user } = useAuth();
    const [view, setView] = useState('board'); // 'board' or 'timeline'

    // Admin/Manager perspective
    const isAdmin = user?.role === 'Admin' || user?.role === 'Manager';

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-white font-outfit">Task Management</h1>
                    <p className="text-slate-400 mt-1">Track projects, timelines, and team productivity</p>
                </div>

                <div className="flex gap-3">
                    <div className="bg-slate-800/60 p-1 rounded-xl glass-panel border border-slate-700/50 flex">
                        <button
                            onClick={() => setView('board')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'board' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400'}`}
                        >Board</button>
                        <button
                            onClick={() => setView('timeline')}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'timeline' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400'}`}
                        >Timeline</button>
                    </div>
                    {isAdmin && (
                        <button className="glass-button flex py-2 px-4 items-center gap-2 text-sm">
                            <Plus size={18} /> New Task
                        </button>
                    )}
                </div>
            </div>

            {view === 'board' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                    {/* Pending Column */}
                    <div className="glass-panel p-4 bg-slate-900/40 border-slate-800/60 min-h-[500px]">
                        <h3 className="text-lg font-bold text-slate-300 mb-4 flex justify-between">
                            Pending <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs">2</span>
                        </h3>
                        <div className="space-y-4">
                            <motion.div layoutId="task1" className="glass-card p-4 border border-slate-700/50 hover:border-indigo-500/50 bg-slate-800/80 cursor-grab relative group">
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={16} className="text-slate-400" />
                                </div>
                                <div className="inline-block px-2 py-1 bg-red-500/10 text-red-500 rounded text-[10px] font-bold tracking-wider mb-2">CRITICAL</div>
                                <h4 className="text-white font-semibold mb-2">Database Migration</h4>
                                <p className="text-xs text-slate-400 leading-relaxed mb-4">Migrate legacy HR data to the new MongoDB schema.</p>

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700/50">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full border-2 border-slate-800 bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">AS</div>
                                        <div className="w-6 h-6 rounded-full border-2 border-slate-800 bg-violet-500 flex items-center justify-center text-[10px] font-bold text-white">JD</div>
                                    </div>
                                    <div className="flex gap-2 text-slate-500 text-xs font-medium">
                                        <span className="flex items-center gap-1"><MessageSquare size={12} /> 3</span>
                                        <span className="flex items-center gap-1"><Paperclip size={12} /> 1</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="glass-panel p-4 bg-slate-900/40 border-slate-800/60 min-h-[500px]">
                        <h3 className="text-lg font-bold text-indigo-300 mb-4 flex justify-between">
                            In Progress <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-xs">1</span>
                        </h3>
                        <div className="space-y-4">
                            <motion.div layoutId="task2" className="glass-card p-4 border border-indigo-500/30 hover:border-indigo-500/50 bg-indigo-900/10 cursor-grab relative group">
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={16} className="text-slate-400" />
                                </div>
                                <div className="inline-block px-2 py-1 bg-amber-500/10 text-amber-500 rounded text-[10px] font-bold tracking-wider mb-2">MEDIUM</div>
                                <h4 className="text-white font-semibold mb-2">Build Admin Dashboard</h4>
                                <p className="text-xs text-slate-400 leading-relaxed mb-4">Implement employee management module in the admin side.</p>

                                <div className="w-full h-1.5 bg-slate-800/80 rounded-full mt-2 mb-4 overflow-hidden">
                                    <div className="h-full bg-indigo-500/80 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" style={{ width: '45%' }} />
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full border-2 border-slate-800 bg-pink-500 flex items-center justify-center text-[10px] font-bold text-white">DP</div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded">
                                        <Clock size={12} className="text-indigo-400" /> Oct 24
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div className="glass-panel p-4 bg-slate-900/40 border-slate-800/60 min-h-[500px]">
                        <h3 className="text-lg font-bold text-emerald-400 mb-4 flex justify-between">
                            Completed <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs">12</span>
                        </h3>
                        <div className="space-y-4">
                            <motion.div layoutId="task3" className="glass-card p-4 border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-900/5 cursor-grab relative group">
                                <div className="inline-block px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-[10px] font-bold tracking-wider mb-2">LOW</div>
                                <h4 className="text-slate-300 font-semibold mb-2 line-through">API Documentation</h4>

                                <div className="flex justify-between items-center mt-4">
                                    <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold"><CheckCircle2 size={14} /> Done</span>
                                    <div className="flex gap-2 text-slate-500 text-xs font-medium">
                                        <span className="flex items-center gap-1"><MessageSquare size={12} /> 8</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                </div>
            )}

            {view === 'timeline' && (
                <div className="glass-panel p-8 flex items-center justify-center min-h-[500px] text-slate-400 border border-slate-700/50">
                    <div className="text-center">
                        <Target size={48} className="mx-auto mb-4 text-indigo-500/50" />
                        <h2 className="text-xl font-bold text-white mb-2">Gantt Chart Timeline View</h2>
                        <p>This interactive timeline feature helps visualize project overlaps.</p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Tasks;
