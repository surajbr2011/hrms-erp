import React, { useState, useEffect } from 'react';
import { X, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const AddTaskModal = ({ isOpen, onClose, onTaskAdded }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            api.get('/users')
                .then(res => setUsers(res.data))
                .catch(err => console.error(err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/tasks', {
                title,
                description,
                assignedTo,
                dueDate,
                priority
            });
            setLoading(false);
            if (onTaskAdded) onTaskAdded();
            onClose();
            // reset
            setTitle('');
            setDescription('');
            setAssignedTo('');
            setDueDate('');
            setPriority('Medium');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-6 w-full max-w-lg bg-slate-900/95 border-slate-700 shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X size={24} />
                </button>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                        <CheckSquare size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white font-outfit">Create New Task</h2>
                </div>

                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Task Title <span className="text-red-400">*</span></label>
                        <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" placeholder="E.g., Q3 Marketing Report" />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" placeholder="Task details..."></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">Assign To <span className="text-red-400">*</span></label>
                            <select required value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 appearance-none">
                                <option value="" disabled hidden>Select Member</option>
                                {users.map(u => (
                                    <option key={u._id} value={u._id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-300 text-sm font-medium mb-1">Due Date <span className="text-red-400">*</span></label>
                            <input required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 [color-scheme:dark]" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Priority</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500 appearance-none">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    
                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full glass-button py-3 flex justify-center items-center font-bold text-base">
                            {loading ? 'Creating Task...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddTaskModal;
