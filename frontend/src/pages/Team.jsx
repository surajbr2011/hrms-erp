import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, Mail, MoreVertical, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AddTeamMemberModal from '../components/AddTeamMemberModal';

const Team = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const teamMembers = [];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white font-outfit">Team Directory</h1>
                    <p className="text-slate-400 mt-1">Manage and view all team members across departments</p>
                </div>

                {(user?.role === 'Manager' || user?.role === 'Admin') && (
                    <button onClick={() => setShowAddModal(true)} className="glass-button flex items-center gap-2">
                        <Plus size={20} /> Add Member
                    </button>
                )}
            </div>

            <div className="glass-panel p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search team members..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-indigo-500 transition-all placeholder-slate-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <button className="glass-button-secondary flex items-center justify-center gap-2 whitespace-nowrap">
                            <Filter size={18} /> Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700/50 text-slate-400 text-sm uppercase tracking-wider bg-slate-800/20">
                                <th className="py-4 pl-4 font-medium rounded-tl-xl">Member</th>
                                <th className="py-4 font-medium">Contact</th>
                                <th className="py-4 font-medium">Role & Dept</th>
                                <th className="py-4 font-medium text-center">Status</th>
                                <th className="py-4 pr-4 font-medium text-center rounded-tr-xl">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {teamMembers
                                .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((member, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={member.id}
                                        className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors"
                                    >
                                        <td className="py-4 pl-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/80 to-violet-500/80 text-white font-bold flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                                                    {member.avatar}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{member.name}</p>
                                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                        {member.role === 'Admin' && <Shield size={12} className="text-indigo-400" />}
                                                        {member.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <Mail size={16} className="text-slate-500" />
                                                {member.email}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${member.department === 'Engineering' ? 'bg-blue-500/10 text-blue-400' :
                                                    member.department === 'Design' ? 'bg-pink-500/10 text-pink-400' :
                                                        member.department === 'HR' ? 'bg-violet-500/10 text-violet-400' :
                                                            'bg-slate-700/50 text-slate-300'
                                                    }`}>
                                                    {member.department}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${member.status === 'Active' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                                                member.status === 'On Leave' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                                                    'border-slate-500/30 text-slate-400 bg-slate-500/10'
                                                }`}>
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-4">
                                            <div className="flex items-center justify-center">
                                                <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                        </tbody>
                    </table>

                    {teamMembers.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            No team members found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            </div>

            <AddTeamMemberModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onUserAdded={() => {
                    // Refresh logic if any
                }}
            />
        </div>
    );
};

export default Team;
