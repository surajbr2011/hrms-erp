import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Briefcase, Calendar as CalendarIcon, FileText, CheckCircle2, ChevronRight, Play, Square, Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import DailyReportModal from '../components/DailyReportModal';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Timer State
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [breakType, setBreakType] = useState(null);
    const [workSeconds, setWorkSeconds] = useState(0);
    const [breakSeconds, setBreakSeconds] = useState(0);
    const [hasAlerted, setHasAlerted] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [checkInTime, setCheckInTime] = useState(null);

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        api.get('/tasks').then(res => setTasks(res.data)).catch(console.error);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        let interval = null;
        if (isCheckedIn && !breakType) {
            interval = setInterval(() => {
                setWorkSeconds(workSeconds => workSeconds + 1);
            }, 1000);
        } else if (isCheckedIn && breakType) {
            interval = setInterval(() => {
                setBreakSeconds(prev => {
                    const newBreakSecs = prev + 1;
                    if (!hasAlerted) {
                        if (breakType === 'Meal' && newBreakSecs === 30 * 60) {
                            alert("Your Meal Break limit (30 mins) has been reached. Please resume work.");
                            setHasAlerted(true);
                        } else if (breakType === 'Tea' && newBreakSecs === 15 * 60) {
                            alert("Your Tea Break limit (15 mins) has been reached. Please resume work.");
                            setHasAlerted(true);
                        }
                    }
                    return newBreakSecs;
                });
            }, 1000);
        } else if (!isCheckedIn && workSeconds !== 0 && !breakType) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isCheckedIn, breakType, hasAlerted, workSeconds]);

    const formatWorkTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleCheckInOut = () => {
        if (isCheckedIn) {
            setShowReportModal(true);
        } else {
            setIsCheckedIn(true);
            setCheckInTime(new Date());
            setWorkSeconds(0);
            setBreakSeconds(0);
            setHasAlerted(false);
        }
    };

    const handleReportClose = () => {
        setShowReportModal(false);
    };

    const handleCheckOutSuccess = () => {
        setShowReportModal(false);
        setIsCheckedIn(false);
        setBreakType(null);
    };

    const toggleBreak = (type) => {
        if (breakType) {
            // Resume work
            setBreakType(null);
            setBreakSeconds(0);
            setHasAlerted(false);
        } else {
            // Start break
            setBreakType(type);
        }
    };

    const currentFormattedTime = format(currentTime, 'hh:mm:ss a');
    const currentDate = format(currentTime, 'EEEE, MMMM do yyyy');

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out pb-10">

            {/* Top Section - Welcome & Time Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                {/* Welcome Card */}
                <div className="lg:col-span-2 glass-panel p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border-indigo-500/30 shadow-[0_8px_32px_rgba(99,102,241,0.15)]">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />

                    <div className="z-10 relative">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-outfit">
                            Good {currentTime.getHours() < 12 ? 'Morning' : 'Afternoon'}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">{user?.name}</span>
                        </h1>
                        <p className="text-slate-300 text-lg mb-8 max-w-xl">
                            Here is what's happening today. You have 3 meetings and 5 pending tasks. Make it a great day!
                        </p>

                        <div className="flex gap-4">
                            <button className="glass-button w-fit text-sm !px-6 py-2.5 font-medium flex items-center gap-2">
                                <FileText size={18} /> View Daily Plan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Check-in Widget */}
                <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden text-center bg-slate-800/80 border-slate-700/50 shadow-xl">
                    <div className="text-sm font-semibold text-slate-400 mb-1">{currentDate}</div>
                    <div className="text-4xl font-bold text-white font-mono tracking-tight mb-6">
                        {currentFormattedTime}
                    </div>

                    <div className="text-indigo-400 text-sm font-medium mb-1 font-mono">
                        Elapsed Time: {formatWorkTime(workSeconds)}
                    </div>
                    {breakType && (
                        <div className={`text-sm font-medium mb-2 font-mono ${hasAlerted ? 'text-red-400' : 'text-amber-400'}`}>
                            {breakType} Break: {formatWorkTime(breakSeconds)}
                        </div>
                    )}

                    <div className="flex flex-col w-full gap-3 mt-4">
                        <button
                            onClick={handleCheckInOut}
                            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${isCheckedIn
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                                : 'bg-indigo-600 border border-indigo-500 hover:bg-indigo-500'
                                }`}
                        >
                            {isCheckedIn ? <><Square size={20} /> Check Out</> : <><Play size={20} fill="currentColor" /> Check In</>}
                        </button>

                        {isCheckedIn && !breakType && (
                            <div className="flex gap-2 w-full">
                                <button
                                    onClick={() => toggleBreak('Meal')}
                                    className="w-1/2 py-3 rounded-xl font-bold transition-all duration-300 flex flex-col gap-1 items-center justify-center text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700"
                                >
                                    <Coffee size={18} /> Meal Break
                                </button>
                                <button
                                    onClick={() => toggleBreak('Tea')}
                                    className="w-1/2 py-3 rounded-xl font-bold transition-all duration-300 flex flex-col gap-1 items-center justify-center text-xs bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700"
                                >
                                    <Coffee size={18} /> Tea Break
                                </button>
                            </div>
                        )}
                        {isCheckedIn && breakType && (
                            <button
                                onClick={() => toggleBreak()}
                                className="w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 border bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30"
                            >
                                <Coffee size={20} /> Resume Work
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Attendance', value: '95%', icon: CalendarIcon, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { label: 'Leave Balance', value: '12 Days', icon: Briefcase, color: 'text-violet-400', bg: 'bg-violet-400/10' },
                    { label: 'Completed Tasks', value: tasks.filter(t => t.status === 'Completed').length.toString(), icon: CheckCircle2, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                    { label: 'Pending Tasks', value: tasks.filter(t => t.status === 'Pending').length.toString(), icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        className="glass-card p-6 flex flex-col justify-center space-y-4 hover:-translate-y-1 transition-transform"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-400 font-medium text-sm mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-white tracking-wide">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Layout - Tables and Feed */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">

                {/* Recent Tasks */}
                <div className="xl:col-span-2 glass-panel p-6 border-slate-700/50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white font-outfit">Priority Tasks</h3>
                        <button className="text-indigo-400 text-sm font-medium hover:text-indigo-300 flex items-center gap-1 transition-colors">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700/50 text-slate-400 text-sm uppercase tracking-wider">
                                    <th className="pb-3 pl-2 font-medium">Task Name</th>
                                    <th className="pb-3 font-medium">Due Date</th>
                                    <th className="pb-3 font-medium text-center">Priority</th>
                                    <th className="pb-3 pr-2 font-medium text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length === 0 ? (
                                    <tr><td colSpan="4" className="py-10 text-center text-slate-500">No priority tasks pending.</td></tr>
                                ) : tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').slice(0, 5).map((task, i) => (
                                    <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                                        <td className="py-4 pl-2 font-medium text-slate-200">{task.title}</td>
                                        <td className="py-4 text-slate-400">{new Date(task.dueDate).toLocaleDateString()}</td>
                                        <td className="py-4 text-center">
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-400">
                                                {task.priority || 'High'}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-2 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${task.status === 'In Progress' ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-slate-700/50 border-slate-600/50 text-slate-300'}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Announcements Widget */}
                <div className="glass-panel p-6 border-slate-700/50 bg-slate-800/60 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white font-outfit">Announcements</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {[].length === 0 ? (
                            <p className="text-slate-500 text-sm text-center pt-4">No announcements yet.</p>
                        ) : [].map((item, i) => (
                            <div key={i} className="glass-card p-4 hover:border-indigo-500/40 rounded-xl bg-slate-900/40 border border-slate-700/50 relative overflow-hidden group">
                                {/* Accent Border Block */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.type === 'alert' ? 'bg-amber-500' : item.type === 'event' ? 'bg-violet-500' : 'bg-indigo-500'} group-hover:w-1.5 transition-all`} />
                                <h4 className="text-slate-200 font-semibold mb-1 pl-3 group-hover:text-indigo-300 transition-colors">{item.title}</h4>
                                <p className="text-xs text-slate-500 font-medium mb-3 pl-3">{item.date}</p>
                                <p className="text-sm text-slate-400 pl-3 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <DailyReportModal
                isOpen={showReportModal}
                onClose={handleReportClose}
                onSuccess={handleCheckOutSuccess}
                totalHours={workSeconds}
                checkInTime={checkInTime}
            />
        </div>
    );
};

export default Dashboard;
