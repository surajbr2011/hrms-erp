import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Target, TrendingUp, Clock, CheckCircle, BarChart3, Users } from 'lucide-react';
import api from '../services/api';

const Performance = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'Admin';
    const isManager = user?.role === 'Manager';

    useEffect(() => {
        const fetchPerformanceData = async () => {
            try {
                // Fetch all users to display performance
                const res = await api.get('/users');
                let usersList = res.data;

                // Role-based filtering
                if (isAdmin) {
                    // Admin sees everyone
                } else if (isManager) {
                    // Manager sees themselves and all Employees
                    usersList = usersList.filter(u => u.role === 'Employee' || u._id === user._id);
                } else {
                    // Employee sees only themselves
                    usersList = usersList.filter(u => u._id === user._id);
                }

                // Append pseudo-randomized (but consistent) performance metrics 
                // In a production environment, this would hit an aggregation endpoint
                const enhancedList = usersList.map(u => {
                    const seed = u._id.charCodeAt(u._id.length - 1);
                    const taskCompletion = Math.min(100, Math.max(0, 60 + (seed % 40)));
                    const attendance = Math.min(100, Math.max(0, 75 + (seed % 25)));
                    const punctuality = Math.min(100, Math.max(0, 70 + (seed % 30)));
                    const overallScore = Math.round((taskCompletion + attendance + punctuality) / 3);

                    let rating = '';
                    if (overallScore >= 90) rating = 'Excellent';
                    else if (overallScore >= 75) rating = 'Good';
                    else if (overallScore >= 60) rating = 'Average';
                    else rating = 'Needs Improvement';

                    return { ...u, performance: { taskCompletion, attendance, punctuality, overallScore, rating } };
                });

                // Sort by overall score descending
                enhancedList.sort((a, b) => b.performance.overallScore - a.performance.overallScore);

                setEmployees(enhancedList);
            } catch (error) {
                console.error('Error fetching performance data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformanceData();
    }, [user, isAdmin, isManager]);

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (score >= 75) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
        if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    };

    const getBarColor = (score) => {
        if (score >= 90) return 'bg-emerald-500';
        if (score >= 75) return 'bg-indigo-500';
        if (score >= 60) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white font-outfit">Performance Indicators</h1>
                    <p className="text-slate-400 mt-1">Track key metrics including task completion, attendance, and punctuality.</p>
                </div>
                <div className="glass-panel px-4 py-2 border-slate-700/50 flex items-center gap-2 font-medium text-slate-300">
                    <Users size={18} className="text-indigo-400" />
                    <span>Viewing {employees.length} Profile{employees.length !== 1 && 's'}</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : employees.length === 0 ? (
                <div className="glass-panel p-10 text-center text-slate-400">No performance data found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    { employees.map((emp) => (
                        <div key={emp._id} className="glass-card p-6 border border-slate-700/50 hover:border-indigo-500/30 transition-colors relative overflow-hidden group">
                            {/* Decorative background glow */}
                            <div className={`absolute -right-20 -top-20 w-40 h-40 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity ${getBarColor(emp.performance.overallScore).replace('bg-', 'bg-')}`} />
                            
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center font-bold text-lg text-white shadow-md">
                                        {emp.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{emp.name}</h3>
                                        <p className="text-xs text-slate-400 font-medium">{emp.role} {emp.designation ? `• ${emp.designation}` : ''}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1.5 rounded-lg border font-bold text-lg ${getScoreColor(emp.performance.overallScore)}`}>
                                    {emp.performance.overallScore}%
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-slate-400 flex items-center gap-1"><CheckCircle size={12} /> Task Completion</span>
                                        <span className="text-slate-200">{emp.performance.taskCompletion}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${getBarColor(emp.performance.taskCompletion)}`} style={{ width: `${emp.performance.taskCompletion}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-slate-400 flex items-center gap-1"><BarChart3 size={12} /> Attendance</span>
                                        <span className="text-slate-200">{emp.performance.attendance}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${getBarColor(emp.performance.attendance)}`} style={{ width: `${emp.performance.attendance}%` }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-slate-400 flex items-center gap-1"><Clock size={12} /> Punctuality</span>
                                        <span className="text-slate-200">{emp.performance.punctuality}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${getBarColor(emp.performance.punctuality)}`} style={{ width: `${emp.performance.punctuality}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center">
                                <span className="text-xs text-slate-400">Current Rating</span>
                                <span className="font-semibold text-sm text-white flex items-center gap-1">
                                    <TrendingUp size={14} className={getScoreColor(emp.performance.overallScore).split(' ')[0]} /> 
                                    {emp.performance.rating}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Performance;
