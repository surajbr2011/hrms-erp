import React, { useState, useEffect } from 'react';
import { Download, FileText, ChevronRight, DownloadCloud, Settings, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Payroll = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('payslips'); // payslips, salary-management
    const [selectedYear, setSelectedYear] = useState('2024');
    const [payslips, setPayslips] = useState([
        { id: 1, month: 'March', year: 2024, date: '2024-03-31', amount: '$4,250.00' },
        { id: 2, month: 'February', year: 2024, date: '2024-02-28', amount: '$4,250.00' },
        { id: 3, month: 'January', year: 2024, date: '2024-01-31', amount: '$4,250.00' }
    ]);

    // Salary Management State
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [salaryForm, setSalaryForm] = useState({
        basicSalary: '', hraPercentage: '', specialAllowance: '', bonus: '', pf: '', professionalTax: ''
    });
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'salary-management') {
            api.get('/users').then(res => setEmployees(res.data)).catch(console.error);
        }
    }, [activeTab]);

    const handleFormChange = (e) => setSalaryForm({ ...salaryForm, [e.target.name]: e.target.value });

    const handleSalarySubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await api.post('/payroll/structure', {
                employeeId: selectedEmployee,
                basicSalary: Number(salaryForm.basicSalary),
                hraPercentage: Number(salaryForm.hraPercentage),
                allowances: [
                    { name: 'Special Allowance', amount: Number(salaryForm.specialAllowance) },
                    { name: 'Bonus', amount: Number(salaryForm.bonus) }
                ],
                deductions: [
                    { name: 'PF', amount: Number(salaryForm.pf) },
                    { name: 'Professional Tax', amount: Number(salaryForm.professionalTax) }
                ]
            });
            alert('Salary Configured Successfully!');
            // Reset form
            setSalaryForm({ basicSalary: '', hraPercentage: '', specialAllowance: '', bonus: '', pf: '', professionalTax: '' });
            setSelectedEmployee('');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Error updating salary. Please make sure all details are filled properly.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDownloadReport = () => {
        const textToSave = `Yearly Payroll Report - ${selectedYear}\n\nEmployee: ${user?.name}\nTotal Paid: $12,750.00\nTaxes Deducted: $1,200.00`;
        const element = document.createElement("a");
        const file = new Blob([textToSave], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `Payroll_Report_${selectedYear}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white font-outfit">Payroll & Salary</h1>
                    <p className="text-slate-400 mt-1">Manage finances, view payslips, and configure salaries</p>
                </div>
                {activeTab === 'payslips' && (
                    <div className="flex gap-3">
                        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="glass-input !py-2 !px-3 appearance-none font-medium cursor-pointer text-white [&>option]:bg-slate-800">
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                        </select>
                        <button onClick={handleDownloadReport} className="glass-button flex items-center gap-2">
                            <DownloadCloud size={20} /> Download Yearly
                        </button>
                    </div>
                )}
            </div>

            <div className="flex space-x-2 border-b border-slate-700/50 pb-px mb-6">
                <button onClick={() => setActiveTab('payslips')} className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'payslips' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}>
                    My Payslips
                    {activeTab === 'payslips' && <motion.div layoutId="tabP" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-500 rounded-t" />}
                </button>
                {(user?.role === 'Manager' || user?.role === 'Admin') && (
                    <button onClick={() => setActiveTab('salary-management')} className={`px-4 py-2 font-medium text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'salary-management' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}>
                        <Settings size={16} /> Salary Configuration
                        {activeTab === 'salary-management' && <motion.div layoutId="tabP" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-500 rounded-t" />}
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'payslips' && (
                    <motion.div key="payslips" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="glass-card p-6 border-indigo-500/30 bg-indigo-900/10">
                                <h3 className="text-slate-400 font-medium mb-1">Current Base Salary</h3>
                                <p className="text-3xl font-bold text-white tracking-wide">$0</p>
                            </div>
                            <div className="glass-card p-6 border-emerald-500/30 bg-emerald-900/10">
                                <h3 className="text-slate-400 font-medium mb-1">Last Paid Amount</h3>
                                <p className="text-3xl font-bold text-white tracking-wide">$0.00</p>
                            </div>
                            <div className="glass-card p-6 border-violet-500/30 bg-violet-900/10">
                                <h3 className="text-slate-400 font-medium mb-1">Tax Deductions (YTD)</h3>
                                <p className="text-3xl font-bold text-white tracking-wide">$0.00</p>
                            </div>
                        </div>

                        <div className="glass-panel overflow-hidden">
                            <div className="p-6 border-b border-slate-700/50"><h2 className="text-xl font-semibold text-white">Payslips - {selectedYear}</h2></div>
                            <div className="divide-y divide-slate-700/50">
                                {payslips.map(slip => (
                                    <div key={slip.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors group">
                                        {/* List details here */}
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center shrink-0 border border-slate-600/50 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 group-hover:text-indigo-300 transition-all">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg">{slip.month} {slip.year}</h4>
                                                <p className="text-sm text-slate-400">Processed on {slip.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-4 sm:mt-0">
                                            <div className="text-left sm:text-right">
                                                <p className="text-sm text-slate-400 mb-1">Net Pay</p>
                                                <p className="font-bold text-white font-mono">{slip.amount}</p>
                                            </div>
                                            <button className="glass-button !p-2 shrink-0 tooltip flex items-center gap-2">
                                                <Download size={20} /> <span className="hidden md:inline mr-1 text-sm font-medium">PDF</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'salary-management' && (
                    <motion.div key="manage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="glass-panel p-6">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><Target className="text-indigo-400" /> Configure Employee Salary</h2>

                        <form onSubmit={handleSalarySubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Select Employee</label>
                                <select required value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="glass-input w-full md:w-1/2 text-white [&>option]:bg-slate-800">
                                    <option value="">-- Choose Employee --</option>
                                    {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name} ({emp.userId || emp.email})</option>)}
                                </select>
                            </div>

                            {selectedEmployee && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-900/40 p-5 rounded-xl border border-slate-700/50">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Basic Salary <span className="text-slate-500">(Yearly)</span></label>
                                        <input required type="number" name="basicSalary" value={salaryForm.basicSalary} onChange={handleFormChange} placeholder="e.g. 60000" className="glass-input w-full text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">HRA Percentage <span className="text-slate-500">(%)</span></label>
                                        <input required type="number" name="hraPercentage" value={salaryForm.hraPercentage} onChange={handleFormChange} placeholder="e.g. 40" className="glass-input w-full text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Special Allowance</label>
                                        <input required type="number" name="specialAllowance" value={salaryForm.specialAllowance} onChange={handleFormChange} placeholder="e.g. 5000" className="glass-input w-full text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Bonus <span className="text-slate-500">(Yearly)</span></label>
                                        <input required type="number" name="bonus" value={salaryForm.bonus} onChange={handleFormChange} placeholder="e.g. 10000" className="glass-input w-full text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">PF Deduction</label>
                                        <input required type="number" name="pf" value={salaryForm.pf} onChange={handleFormChange} placeholder="e.g. 2400" className="glass-input w-full text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Professional Tax</label>
                                        <input required type="number" name="professionalTax" value={salaryForm.professionalTax} onChange={handleFormChange} placeholder="e.g. 200" className="glass-input w-full text-white" />
                                    </div>

                                    <div className="md:col-span-2 lg:col-span-3 pt-4 border-t border-slate-700/50">
                                        <button type="submit" className="glass-button w-full sm:w-auto px-8 py-3 flex justify-center items-center text-sm font-bold">
                                            Save Salary Structure
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Payroll;
