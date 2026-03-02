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

                        {/* Other tabs placeholders */}
                        {activeTab !== 'general' && (
                            <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                                <SettingsIcon size={48} className="mb-4 text-slate-500/50" />
                                <p className="font-outfit text-lg">Configuration options for {tabs.find(t => t.id === activeTab)?.label} will appear here.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
