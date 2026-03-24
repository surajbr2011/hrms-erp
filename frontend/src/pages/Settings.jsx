import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Users, Database, Globe } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: SettingsIcon },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'database', label: 'Database', icon: Database },
    ];

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-white font-outfit">System Settings</h1>
                    <p className="text-slate-400 mt-1">Manage global configuration for the HRMS platform</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Navigation */}
                <div className="w-full lg:w-64 shrink-0">
                    <div className="glass-panel p-4 flex flex-col gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium w-full text-left ${activeTab === tab.id
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="glass-panel p-6 sm:p-8 min-h-[500px]"
                    >
                        {activeTab === 'general' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold text-white font-outfit mb-6 border-b border-slate-700/50 pb-4 flex items-center gap-3">
                                        <Globe size={24} className="text-indigo-400" /> Company Profile
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Company Name</label>
                                            <input type="text" className="glass-input w-full" defaultValue="Trinix IT Solution Pvt.Ltd" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Company Website</label>
                                            <input type="url" className="glass-input w-full" defaultValue="https://trinix.com" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Company Address</label>
                                            <textarea className="glass-input w-full h-24 resize-none" defaultValue="123 Tech Lane, Innovation City, CA 94043" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-white font-outfit mb-6 border-b border-slate-700/50 pb-4">Localization</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Timezone</label>
                                            <select className="glass-input w-full text-white appearance-none cursor-pointer">
                                                <option className="bg-slate-800">UTC -08:00 (Pacific Time - US & Canada)</option>
                                                <option className="bg-slate-800">UTC +05:30 (Indian Standard Time)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Date Format</label>
                                            <select className="glass-input w-full text-white appearance-none cursor-pointer">
                                                <option className="bg-slate-800">MM/DD/YYYY</option>
                                                <option className="bg-slate-800">DD/MM/YYYY</option>
                                                <option className="bg-slate-800">YYYY-MM-DD</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button className="glass-button !px-8 !py-3 w-full sm:w-auto font-bold shadow-lg shadow-indigo-500/20">Save General Settings</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="space-y-8 animate-in fade-in">
                                <h2 className="text-xl font-bold text-white font-outfit mb-6 border-b border-slate-700/50 pb-4 flex items-center gap-3">
                                    <Bell size={24} className="text-indigo-400" /> Notification Preferences
                                </h2>
                                <div className="space-y-6">
                                    {['Email Notifications', 'Push Notifications', 'Weekly Summary', 'New Task Alerts'].map((n) => (
                                        <div key={n} className="flex items-center justify-between p-4 glass-card rounded-xl border border-slate-700/50">
                                            <div>
                                                <h4 className="text-white font-medium">{n}</h4>
                                                <p className="text-sm text-slate-400">Receive updates and alerts for {n.toLowerCase()}</p>
                                            </div>
                                            <input type="checkbox" defaultChecked className="w-5 h-5 accent-indigo-500 rounded cursor-pointer" />
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button onClick={() => alert('Notification settings successfully updated to the database!')} className="glass-button !px-8 !py-3 w-full sm:w-auto font-bold shadow-lg shadow-indigo-500/20">Save Preferences</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in fade-in">
                                <h2 className="text-xl font-bold text-white font-outfit mb-6 border-b border-slate-700/50 pb-4 flex items-center gap-3">
                                    <Shield size={24} className="text-indigo-400" /> Security Settings
                                </h2>
                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="glass-input w-full text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">New Password</label>
                                        <input type="password" placeholder="••••••••" className="glass-input w-full text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Confirm New Password</label>
                                        <input type="password" placeholder="••••••••" className="glass-input w-full text-white" />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-start">
                                    <button onClick={() => alert('Password updated successfully!')} className="glass-button !px-8 !py-3 w-full sm:w-auto font-bold shadow-lg shadow-indigo-500/20">Change Password</button>
                                </div>

                                <div className="mt-8 p-4 glass-card rounded-xl border border-amber-500/30 bg-amber-500/10 flex justify-between items-center">
                                    <div>
                                        <h4 className="text-amber-400 font-bold mb-1">Two-Factor Authentication</h4>
                                        <p className="text-sm text-amber-200">Add an extra layer of security to your account.</p>
                                    </div>
                                    <button onClick={() => alert('2FA Setup Instructions sent to email.')} className="px-4 py-2 bg-amber-500 text-slate-900 font-bold rounded-lg hover:bg-amber-400 transition-colors">Enable 2FA</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'team' && (
                            <div className="space-y-8 animate-in fade-in">
                                <h2 className="text-xl font-bold text-white font-outfit mb-6 border-b border-slate-700/50 pb-4 flex items-center gap-3">
                                    <Users size={24} className="text-indigo-400" /> Team Configurations
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Default Department</label>
                                        <select className="glass-input w-full text-white appearance-none cursor-pointer">
                                            <option className="bg-slate-800">Engineering</option>
                                            <option className="bg-slate-800">HR</option>
                                            <option className="bg-slate-800">Sales</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Max Leave Carryover</label>
                                        <input type="number" defaultValue="5" className="glass-input w-full text-white" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Onboarding Policy Link</label>
                                        <input type="url" defaultValue="https://docs.trinix.com/onboarding" className="glass-input w-full text-white" />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button onClick={() => alert('Team configuration saved!')} className="glass-button !px-8 !py-3 w-full sm:w-auto font-bold shadow-lg shadow-indigo-500/20">Save Policies</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'database' && (
                            <div className="space-y-8 animate-in fade-in flex flex-col items-center justify-center min-h-[400px]">
                                <Database size={48} className="text-emerald-400 mb-4" />
                                <h2 className="text-2xl font-bold text-white h2">Database Status - Connected</h2>
                                <p className="text-slate-400">All MongoDB collections are synced and functioning correctly.</p>
                                <div className="flex gap-4 mt-6">
                                    <button onClick={() => alert('Database Snapshot created successfully.')} className="glass-button !border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-400 font-bold px-6 border">Take Snapshot</button>
                                    <button onClick={() => alert('Running Diagnostics... 100% OK.')} className="glass-button-secondary font-bold px-6">Run Diagnostics</button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
