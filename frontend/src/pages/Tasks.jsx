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
                            Pending <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs">0</span>
                        </h3>
                        <div className="space-y-4">
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="glass-panel p-4 bg-slate-900/40 border-slate-800/60 min-h-[500px]">
                        <h3 className="text-lg font-bold text-indigo-300 mb-4 flex justify-between">
                            In Progress <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-xs">0</span>
                        </h3>
                        <div className="space-y-4">
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div className="glass-panel p-4 bg-slate-900/40 border-slate-800/60 min-h-[500px]">
                        <h3 className="text-lg font-bold text-emerald-400 mb-4 flex justify-between">
                            Completed <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs">0</span>
                        </h3>
                        <div className="space-y-4">
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
