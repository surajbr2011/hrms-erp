import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        department: '',
        role: user?.role || '',
        joinDate: '',
    });

    const handleSave = () => {
        setIsEditing(false);
        // Add API call to update profile logic here
    };

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto pb-10">

            {/* Profile Header */}
            <div className="glass-panel relative overflow-hidden bg-slate-800/80">
                {/* Cover Photo */}
                <div className="h-48 md:h-64 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 relative overflow-hidden backdrop-blur-3xl">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/90 to-transparent" />
                    {isEditing && (
                        <button className="absolute top-4 right-4 glass-button-secondary !py-2 !px-3 font-semibold text-sm backdrop-blur-lg border-white/20">
                            <Camera size={16} className="inline mr-2 text-indigo-200" />
                            Change Cover
                        </button>
                    )}
                </div>

                {/* Avatar & Basic Info */}
                <div className="px-6 md:px-10 pb-8 relative -mt-16 md:-mt-20 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-900 overflow-hidden bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-2xl flex items-center justify-center shrink-0">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-5xl md:text-6xl font-bold text-white tracking-wider">
                                    {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('') : ''}
                                </span>
                            )}
                        </div>
                        {isEditing && (
                            <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={28} className="text-white" />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left mb-2 md:mb-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-white font-outfit tracking-wide">{profileData.name}</h1>
                        <p className="text-indigo-400 font-medium text-lg mt-1">{profileData.role} • {profileData.department}</p>
                    </div>

                    <div className="flex gap-3 mb-2 md:mb-4 w-full md:w-auto">
                        {isEditing ? (
                            <button onClick={handleSave} className="glass-button flex items-center justify-center gap-2 flex-1 md:flex-none">
                                <Save size={18} /> Save Changes
                            </button>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="glass-button-secondary flex items-center justify-center gap-2 flex-1 md:flex-none">
                                <Camera size={18} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

                {/* Left Column - Contact Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="glass-panel p-6 border-slate-700/50 bg-slate-800/60">
                        <h3 className="text-lg font-bold text-white mb-6 font-outfit border-b border-slate-700/50 pb-3">Contact Information</h3>

                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Email</p>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                            className="glass-input w-full py-1.5 px-3 text-sm"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-slate-200">{profileData.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Phone</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={profileData.phone}
                                            onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="glass-input w-full py-1.5 px-3 text-sm"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-slate-200">{profileData.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Address</p>
                                    {isEditing ? (
                                        <textarea
                                            value={profileData.address}
                                            onChange={e => setProfileData({ ...profileData, address: e.target.value })}
                                            className="glass-input w-full py-1.5 px-3 text-sm resize-none h-20"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-slate-200 leading-relaxed">{profileData.address}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Work Details & Security */}
                <div className="md:col-span-2 space-y-6">
                    <div className="glass-panel p-6 sm:p-8 border-slate-700/50">
                        <h3 className="text-xl font-bold text-white mb-6 font-outfit border-b border-slate-700/50 pb-4">Work Information</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 hover:border-indigo-500/30 transition-colors">
                                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 border border-blue-500/20 shadow-inner">
                                    <Briefcase size={22} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Department</p>
                                    {isEditing && (user?.role === 'Manager' || user?.role === 'Admin') ? (
                                        <select
                                            value={profileData.department}
                                            onChange={e => setProfileData({ ...profileData, department: e.target.value })}
                                            className="glass-input w-full py-2 text-sm"
                                        >
                                            <option className="bg-slate-800">Engineering</option>
                                            <option className="bg-slate-800">Design</option>
                                            <option className="bg-slate-800">Marketing</option>
                                            <option className="bg-slate-800">HR</option>
                                        </select>
                                    ) : (
                                        <p className="text-base font-medium text-slate-200">{profileData.department}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 hover:border-indigo-500/30 transition-colors">
                                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 shrink-0 border border-amber-500/20 shadow-inner">
                                    <Shield size={22} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5">System Role</p>
                                    <p className="text-base font-medium text-slate-200 flex items-center gap-2">
                                        {profileData.role}
                                        {profileData.role === 'Admin' && <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-red-500/20" />}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 hover:border-indigo-500/30 transition-colors sm:col-span-2">
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 border border-emerald-500/20 shadow-inner">
                                    <Calendar size={22} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1.5">Date of Joining</p>
                                    <p className="text-base font-medium text-slate-200">{profileData.joinDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 sm:p-8 border-slate-700/50">
                        <h3 className="text-xl font-bold text-white mb-6 font-outfit border-b border-slate-700/50 pb-4">Security Settings</h3>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
                            <div>
                                <h4 className="font-semibold text-slate-200 mb-1">Password</h4>
                                <p className="text-sm text-slate-500 font-medium">Last changed 3 months ago</p>
                            </div>
                            <button className="glass-button-secondary !py-2 !px-4 text-sm font-semibold border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 whitespace-nowrap">
                                Change Password
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 mt-4">
                            <div>
                                <h4 className="font-semibold text-slate-200 mb-1">Two-Factor Authentication</h4>
                                <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-400 block" /> Currently Disabled
                                </p>
                            </div>
                            <button className="glass-button !py-2 !px-4 text-sm font-semibold whitespace-nowrap">
                                Enable 2FA
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
