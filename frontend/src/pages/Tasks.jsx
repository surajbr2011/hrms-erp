import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Target, Clock, MessageSquare, Paperclip, CheckCircle2, MoreVertical, Plus } from 'lucide-react';
import api from '../services/api';
import AddTaskModal from '../components/AddTaskModal';

const Tasks = () => {
    const { user } = useAuth();
    const [view, setView] = useState('board'); // 'board' or 'timeline'
    const [tasks, setTasks] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);

    const [openDropdownId, setOpenDropdownId] = useState(null);

    // Admin/Manager perspective
    const isAdmin = user?.role === 'Admin' || user?.role === 'Manager';

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleUpdateStatus = async (taskId, status) => {
        try {
            await api.put(`/tasks/${taskId}`, { status });
            fetchTasks();
            setOpenDropdownId(null);
        } catch (error) {
            console.error('Error updating task status:', error);
            alert('Failed to update task status');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                fetchTasks();
                setOpenDropdownId(null);
            } catch (error) {
                console.error('Error deleting task:', error);
                alert('Failed to delete task');
            }
        }
    };

    const pendingTasks = tasks.filter(t => t.status === 'Pending');
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
    const completedTasks = tasks.filter(t => t.status === 'Completed');

    const TaskCard = ({ task }) => (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer shadow-lg relative">
            <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${task.priority === 'High' ? 'bg-rose-500/20 text-rose-400' : task.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {task.priority || 'Medium'}
                </span>
                
                <div className="relative">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(openDropdownId === task._id ? null : task._id);
                        }} 
                        className="text-slate-500 hover:text-slate-300 p-1"
                    >
                        <MoreVertical size={16} />
                    </button>
                    
                    {openDropdownId === task._id && (
                        <div className="absolute right-0 top-6 w-36 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 overflow-hidden text-sm">
                            {task.status !== 'In Progress' && task.status !== 'Completed' && (
                                <button onClick={() => handleUpdateStatus(task._id, 'In Progress')} className="w-full text-left px-4 py-2 text-indigo-400 hover:bg-slate-700 transition-colors">Mark In Progress</button>
                            )}
                            {task.status !== 'Completed' && (
                                <button onClick={() => handleUpdateStatus(task._id, 'Completed')} className="w-full text-left px-4 py-2 text-emerald-400 hover:bg-slate-700 transition-colors">Mark Completed</button>
                            )}
                            {task.status !== 'Pending' && (
                                <button onClick={() => handleUpdateStatus(task._id, 'Pending')} className="w-full text-left px-4 py-2 text-amber-400 hover:bg-slate-700 transition-colors">Mark Pending</button>
                            )}
                            {isAdmin && (
                                <button onClick={() => handleDeleteTask(task._id)} className="w-full text-left px-4 py-2 text-rose-400 hover:bg-slate-700 transition-colors border-t border-slate-700/50">Delete Task</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <h4 className="text-white font-medium mb-1 leading-tight">{task.title}</h4>
            <div className="text-xs text-slate-400 mb-4 line-clamp-2">{task.description}</div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-700/50 border-dashed">
                <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500 text-white text-[10px] flex justify-center items-center border border-slate-800" title={task.assignedTo?.name || 'Unassigned'}>
                        {task.assignedTo?.name?.substring(0, 2).toUpperCase() || 'NA'}
                    </div>
                </div>
                <div className="text-xs flex items-center gap-1 text-slate-400 font-medium">
                    <Clock size={12} className={new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'text-rose-400' : 'text-slate-500'} />
                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
            </div>
        </motion.div>
    );

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
                        <button onClick={() => setShowAddModal(true)} className="glass-button flex py-2 px-4 items-center gap-2 text-sm">
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
                            Pending <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs">{pendingTasks.length}</span>
                        </h3>
                        <div className="space-y-4">
                            {pendingTasks.map(t => <TaskCard key={t._id} task={t} />)}
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="glass-panel p-4 bg-slate-900/40 border-slate-800/60 min-h-[500px]">
                        <h3 className="text-lg font-bold text-indigo-300 mb-4 flex justify-between">
                            In Progress <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded text-xs">{inProgressTasks.length}</span>
                        </h3>
                        <div className="space-y-4">
                            {inProgressTasks.map(t => <TaskCard key={t._id} task={t} />)}
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div className="glass-panel p-4 bg-slate-900/40 border-slate-800/60 min-h-[500px]">
                        <h3 className="text-lg font-bold text-emerald-400 mb-4 flex justify-between">
                            Completed <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs">{completedTasks.length}</span>
                        </h3>
                        <div className="space-y-4">
                            {completedTasks.map(t => <TaskCard key={t._id} task={t} />)}
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

            <AddTaskModal 
                isOpen={showAddModal} 
                onClose={() => setShowAddModal(false)} 
                onTaskAdded={fetchTasks} 
            />
        </div>
    );
};

export default Tasks;
