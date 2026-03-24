import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, CheckCircle, XCircle, Settings } from 'lucide-react';
import api from '../services/api';

const Leaves = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState(user?.role === 'Admin' ? 'team' : 'apply'); // apply, history, team, holidays
    const [holidays, setHolidays] = useState([]);

    // Apply leave states
    const [leaveType, setLeaveType] = useState('Casual Leave');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [duration, setDuration] = useState('Full Day');

    useEffect(() => {
        if (activeTab === 'holidays' || activeTab === 'apply') {
            api.get('/holidays').then(res => setHolidays(res.data)).catch(console.error);
        }
    }, [activeTab]);

    const leaveHistory = [];
    const teamLeaves = [];

    const isDateHoliday = (dateString) => {
        const date = new Date(dateString);
        return holidays.some(h => {
            const hd = new Date(h.date);
            return hd.getDate() === date.getDate() && hd.getMonth() === date.getMonth() && hd.getFullYear() === date.getFullYear();
        });
    };

    const handleApply = async (e) => {
        e.preventDefault();

        if (new Date(endDate) < new Date(startDate)) {
            alert('End Date cannot be earlier than Start Date.');
            return;
        }

        // Prevent applying on holiday
        if (isDateHoliday(startDate) || isDateHoliday(endDate)) {
            alert('Cannot apply leave on a public holiday.');
            return;
        }

        try {
            await api.post('/leaves', {
                leaveType, startDate, endDate, reason
            });
            alert('Leave applied successfully');
            setActiveTab('history');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to apply leave');
        }
    };

    const getLeaveTypes = () => {
        return ['Casual Leave', 'Sick Leave', 'Earned Leave'];
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-white font-outfit">Leave Management</h1>
                <p className="text-slate-400 mt-1">Apply for leaves and track your requests</p>
            </div>

            <div className="flex space-x-2 border-b border-slate-700/50 pb-px mb-6 overflow-x-auto custom-scrollbar whitespace-nowrap">
                {user?.role !== 'Admin' && (
                    <>
                        <button onClick={() => setActiveTab('apply')} className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'apply' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}>
                            Apply Leave
                            {activeTab === 'apply' && <motion.div layoutId="activeTabL" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-500 rounded-t" />}
                        </button>
                        <button onClick={() => setActiveTab('history')} className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'history' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}>
                            My History
                            {activeTab === 'history' && <motion.div layoutId="activeTabL" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-500 rounded-t" />}
                        </button>
                    </>
                )}
                <button onClick={() => setActiveTab('holidays')} className={`px-4 py-2 font-medium text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'holidays' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}>
                    <Calendar size={16} /> Holiday Calendar
                    {activeTab === 'holidays' && <motion.div layoutId="activeTabL" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-500 rounded-t" />}
                </button>
                {(user?.role === 'Manager' || user?.role === 'Admin') && (
                    <button onClick={() => setActiveTab('team')} className={`px-4 py-2 font-medium text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'team' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}>
                        Team Requests
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">0</span>
                        {activeTab === 'team' && <motion.div layoutId="activeTabL" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-500 rounded-t" />}
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'apply' && (
                    <motion.div key="apply" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 glass-panel p-6">
                            <h2 className="text-xl font-semibold text-white mb-6">New Leave Request</h2>
                            <form onSubmit={handleApply} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Leave Type</label>
                                        <select value={leaveType} onChange={e => setLeaveType(e.target.value)} className="glass-input w-full appearance-none">
                                            {getLeaveTypes().map(t => <option key={t} value={t} className="bg-slate-800">{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Duration</label>
                                        <select value={duration} onChange={e => setDuration(e.target.value)} className="glass-input w-full appearance-none">
                                            <option className="bg-slate-800" value="Full Day">Full Day</option>
                                            <option className="bg-slate-800" value="First Half">First Half</option>
                                            <option className="bg-slate-800" value="Second Half">Second Half</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
                                        <input required type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={`glass-input w-full [color-scheme:dark] ${isDateHoliday(startDate) ? 'border-red-500 focus:border-red-500 text-red-400' : ''}`} />
                                        {isDateHoliday(startDate) && <span className="text-xs text-red-500 font-medium">This date is a public holiday</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">End Date</label>
                                        <input required type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={`glass-input w-full [color-scheme:dark] ${isDateHoliday(endDate) ? 'border-red-500 focus:border-red-500 text-red-400' : ''}`} />
                                        {isDateHoliday(endDate) && <span className="text-xs text-red-500 font-medium">This date is a public holiday</span>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Reason for Leave</label>
                                    <textarea required value={reason} onChange={e => setReason(e.target.value)} rows="4" className="glass-input w-full resize-none" placeholder="Provide a brief explanation..."></textarea>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button type="button" className="glass-button-secondary mr-3" onClick={() => { setStartDate(''); setEndDate(''); setReason(''); }}>Reset</button>
                                    <button type="submit" disabled={isDateHoliday(startDate) || isDateHoliday(endDate)} className="glass-button disabled:opacity-50">Submit Request</button>
                                </div>
                            </form>
                        </div>

                        <div className="space-y-4">
                            <div className="glass-panel p-6 bg-gradient-to-br from-indigo-900/20 to-slate-900/60 object-cover border-indigo-500/20">
                                <h3 className="font-semibold text-white mb-4">Leave Balances</h3>
                                <div className="space-y-4">
                                    {[
                                        { type: 'Earned', total: 20, used: 0, color: 'emerald' },
                                        { type: 'Sick', total: 10, used: 0, color: 'rose' },
                                        { type: 'Casual', total: 5, used: 0, color: 'blue' }
                                    ].map(bal => (
                                        <div key={bal.type}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-300">{bal.type} Leave</span>
                                                <span className="font-medium text-white">{bal.total - bal.used} / {bal.total}</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden">
                                                <div className={`h-full bg-${bal.color}-500/80 shadow-[0_0_8px_rgba(currentColor,0.5)] bg-${bal.color}-400 rounded-full`} style={{ width: `${(bal.used / bal.total) * 100}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'holidays' && (
                    <motion.div key="holidays" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="glass-panel p-6">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><Calendar className="text-indigo-400" /> Company Holidays</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-700/50 text-slate-400 text-sm uppercase tracking-wider bg-slate-800/20">
                                        <th className="py-4 pl-4 font-medium rounded-tl-xl">Date</th>
                                        <th className="py-4 font-medium">Holiday Name</th>
                                        <th className="py-4 font-medium">Type</th>
                                        <th className="py-4 pr-4 font-medium rounded-tr-xl">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {holidays.length > 0 ? holidays.map((h, i) => (
                                        <tr key={i} className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors">
                                            <td className="py-4 pl-4 font-medium text-white">{new Date(h.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                            <td className="py-4 text-indigo-300 font-semibold">{h.name}</td>
                                            <td className="py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${h.type === 'Public' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                                    {h.type}
                                                </span>
                                            </td>
                                            <td className="py-4 pr-4 text-slate-400 text-sm">{h.description}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="4" className="text-center py-10 text-slate-400">No holidays found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* ... other tabs would go here ... */}

            </AnimatePresence>
        </div>
    );
};

export default Leaves;
