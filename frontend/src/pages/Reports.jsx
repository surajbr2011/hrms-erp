import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, Filter, FileSpreadsheet, FileIcon as FilePdf, CheckCircle, MessageSquare } from 'lucide-react';
import api from '../services/api';

const Reports = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('analytics'); // analytics, daily
    const [reportType, setReportType] = useState('attendance');
    const [dateRange, setDateRange] = useState('this-month');
    const [isLoading, setIsLoading] = useState(false);

    // Daily Reports State
    const [dailyReports, setDailyReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(false);
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        if (activeTab === 'daily') {
            fetchDailyReports();
        }
    }, [activeTab, filterDate]);

    const fetchDailyReports = async () => {
        setLoadingReports(true);
        try {
            const res = await api.get(`/daily-reports${filterDate ? `?date=${filterDate}` : ''}`);
            setDailyReports(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoadingReports(false);
    };

    const handleUpdateStatus = async (id, status, comment) => {
        try {
            await api.put(`/daily-reports/${id}`, { status, adminComment: comment });
            fetchDailyReports();
        } catch (err) {
            console.error(err);
        }
    };

    const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

    const handleGenerate = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (reportType === 'attendance') {
                window.open(`${API_BASE}/api/reports/attendance/pdf`, '_blank');
            } else if (reportType === 'payroll') {
                window.open(`${API_BASE}/api/reports/payroll/pdf`, '_blank');
            }
        }, 1500);
    };

    if (user?.role !== 'Admin' && user?.role !== 'Manager') {
        return <div className="text-white">You do not have permission to view this page.</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-white font-outfit">Report Management</h1>
                <p className="text-slate-400 mt-1">Generate analytics and monitor daily work reports</p>
            </div>

            <div className="flex space-x-2 border-b border-slate-700/50 pb-px mb-6">
                <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'analytics' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}>
                    Analytics Reports
                    {activeTab === 'analytics' && <motion.div layoutId="tabsReports" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-500 rounded-t" />}
                </button>
                <button onClick={() => setActiveTab('daily')} className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'daily' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}>
                    Daily Work Reports
                    {activeTab === 'daily' && <motion.div layoutId="tabsReports" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-500 rounded-t" />}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'analytics' && (
                    <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-panel p-6">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><FileText size={20} className="text-indigo-400" /> Generate New Report</h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Report Type</label>
                                    <select value={reportType} onChange={e => setReportType(e.target.value)} className="glass-input w-full cursor-pointer appearance-none text-white [&>option]:bg-slate-800">
                                        <option value="attendance">Attendance Report</option>
                                        <option value="leave">Leave Report</option>
                                        <option value="payroll">Payroll Report</option>
                                        <option value="performance">Task Performance Report</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Time Period</label>
                                    <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="glass-input w-full cursor-pointer appearance-none text-white [&>option]:bg-slate-800">
                                        <option value="this-month">This Month</option>
                                        <option value="last-month">Last Month</option>
                                        <option value="this-quarter">This Quarter</option>
                                        <option value="this-year">This Year</option>
                                    </select>
                                </div>
                                <div className="pt-4 border-t border-slate-700/50 flex gap-4">
                                    <button onClick={handleGenerate} disabled={isLoading} className="glass-button flex-1 flex justify-center items-center gap-2">
                                        {isLoading ? 'Generating...' : <><FilePdf size={18} /> Export as PDF</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'daily' && (
                    <motion.div key="daily" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="glass-panel p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <h2 className="text-xl font-semibold text-white">All Employee Submissions</h2>
                            <div className="flex gap-4">
                                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="glass-input text-sm px-3 py-2 text-white [color-scheme:dark]" />
                            </div>
                        </div>

                        {loadingReports ? (
                            <div className="text-center py-10 text-slate-400">Loading reports...</div>
                        ) : dailyReports.length === 0 ? (
                            <div className="text-center py-10 text-slate-400 glass-card">No daily reports found for this date.</div>
                        ) : (
                            <div className="space-y-4">
                                {dailyReports.map(report => (
                                    <div key={report._id} className="glass-card p-5 border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                                        <div className="flex flex-col lg:flex-row justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-white text-lg">{report.employeeName}</h3>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${report.status === 'Reviewed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{report.status}</span>
                                                    <span className="text-xs text-slate-400">{new Date(report.date).toLocaleDateString()} • {report.totalHours.toFixed(1)} hrs</span>
                                                </div>
                                                <h4 className="text-indigo-300 font-medium mb-1">{report.title}</h4>
                                                <p className="text-slate-300 text-sm mb-3 whitespace-pre-wrap">{report.description}</p>

                                                {report.attachmentFiles?.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {report.attachmentFiles.map((file, i) => (
                                                            <a key={i} href={`${API_BASE}${file}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/50">
                                                                <Download size={14} /> Attachment {i + 1}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="lg:w-64 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                                <label className="block text-xs font-medium text-slate-400 mb-2 uppercase">Admin Review</label>
                                                <textarea
                                                    placeholder="Add comment..."
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500 h-20 mb-2 resize-none"
                                                    defaultValue={report.adminComment || ''}
                                                    onBlur={(e) => {
                                                        if (e.target.value !== report.adminComment) {
                                                            handleUpdateStatus(report._id, report.status, e.target.value);
                                                        }
                                                    }}
                                                />
                                                {report.status !== 'Reviewed' && (
                                                    <button onClick={() => handleUpdateStatus(report._id, 'Reviewed', report.adminComment)} className="w-full py-1.5 flex justify-center items-center gap-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-sm font-medium transition-colors">
                                                        <CheckCircle size={16} /> Mark Reviewed
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Reports;
