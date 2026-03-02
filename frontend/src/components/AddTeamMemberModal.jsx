import React, { useState, useEffect } from 'react';
import { X, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const AddTeamMemberModal = ({ isOpen, onClose, onUserAdded }) => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', gender: 'Male', department: '', designation: '', reportingManager: '', role: 'Employee', userId: '', password: ''
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            api.get('/users').then(res => setUsers(res.data)).catch(err => console.error(err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/users', formData);
            setLoading(false);
            if (onUserAdded) onUserAdded();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border-slate-700 shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X size={24} />
                </button>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                        <UserPlus size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white font-outfit">Add New Team Member</h2>
                </div>

                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Full Name</label>
                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Email</label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Phone</label>
                        <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Department</label>
                        <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="Optional ID or name" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Role</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500">
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Reporting Manager</label>
                        <select name="reportingManager" value={formData.reportingManager} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500">
                            <option value="">None</option>
                            {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">User ID</label>
                        <input required type="text" name="userId" value={formData.userId} onChange={handleChange} placeholder="e.g. EMP-001" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-slate-300 text-sm font-medium mb-1">Password</label>
                        <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" />
                    </div>
                    <div className="md:col-span-2 pt-4">
                        <button type="submit" disabled={loading} className="w-full glass-button py-3 flex justify-center items-center font-bold text-base">
                            {loading ? 'Creating...' : 'Create Team Member'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddTeamMemberModal;
