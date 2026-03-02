import React, { useState } from 'react';
import { X, Upload, File } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const DailyReportModal = ({ isOpen, onClose, checkInTime, totalHours }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [workSummary, setWorkSummary] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!description) {
            setError('Description is mandatory.');
            return;
        }

        if (files.length === 0) {
            setError('At least one attachment (image or PDF) is required.');
            return;
        }

        setLoading(true);

        try {
            // First, upload files
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            const uploadRes = await api.post('/upload/daily-report', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const filePaths = uploadRes.data.filePaths;

            // Submit report
            await api.post('/daily-reports', {
                date: new Date(),
                checkInTime: checkInTime || new Date(),
                checkOutTime: new Date(),
                totalHours: totalHours / 3600, // converting seconds to hours
                title,
                description,
                workSummary,
                attachmentFiles: filePaths
            });

            setLoading(false);
            onClose(); // Reset and close
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit report');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-900/90 border-slate-700 shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold text-white mb-4">Daily Work Report</h2>
                <p className="text-slate-400 text-sm mb-6">Please submit your report to successfully check-out.</p>

                {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="E.g., Daily Progress" />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Description <span className="text-red-400">*</span></label>
                        <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 h-24" placeholder="Describe the key tasks completed..." />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Work Summary</label>
                        <textarea value={workSummary} onChange={e => setWorkSummary(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 h-20" placeholder="Detailed summary..." />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-1">Attachments (Required) <span className="text-red-400">*</span></label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-3 text-slate-400" />
                                    <p className="mb-2 text-sm text-slate-400"><span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-slate-500">PDF, PNG, JPG (Max 5MB per file)</p>
                                </div>
                                <input type="file" className="hidden" multiple accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
                            </label>
                        </div>
                        {files.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800 p-2 rounded">
                                        <File size={16} className="text-indigo-400" />
                                        <span className="truncate">{f.name}</span>
                                        <span className="text-slate-500 text-xs ml-auto">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full glass-button py-3 flex justify-center items-center font-bold">
                            {loading ? 'Submitting...' : 'Submit Report & Check-Out'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default DailyReportModal;
