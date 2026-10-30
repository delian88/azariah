import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  FileText,
  Printer,
  Trash2,
  CheckCircle2,
  Clock,
  Send,
  Calendar,
  RefreshCw,
  Plus,
  Check,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import {
  developerService,
  Payslip,
  Developer,
  formatLocalDate
} from '../../services/developerService';
import {
  printAdminPayrollReport,
  printSinglePayslipVoucher
} from '../../services/reportPrinter';

interface AdminPayrollTabProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminPayrollTab: React.FC<AdminPayrollTabProps> = ({ showToast }) => {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(false);

  // Summary Metrics
  const [summary, setSummary] = useState({
    totalPayslips: 0,
    totalAmount: 0,
    confirmedCount: 0,
    pendingConfirmationCount: 0
  });

  // Filter
  const [selectedDevFilter, setSelectedDevFilter] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState('');

  // Issue Payslip Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);

  // Form State
  const [developerId, setDeveloperId] = useState<number | ''>('');
  const [periodStart, setPeriodStart] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
  });
  const [periodEnd, setPeriodEnd] = useState(() => new Date().toISOString().split('T')[0]);
  const [hoursBilled, setHoursBilled] = useState<number | ''>(0);
  const [hourlyRate, setHourlyRate] = useState<number | ''>(45);
  const [bonus, setBonus] = useState<number | ''>(0);
  const [deductions, setDeductions] = useState<number | ''>(0);
  const [totalAmount, setTotalAmount] = useState<number | ''>(0);
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('Bank Wire Transfer');
  const [notes, setNotes] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  // Selected Payslip for Voucher View / Print
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [payslipsRes, devsRes] = await Promise.all([
        developerService.adminGetPayslips({
          developerId: selectedDevFilter ? Number(selectedDevFilter) : undefined,
          status: statusFilter || undefined
        }),
        developerService.adminGetDevelopers()
      ]);

      if (payslipsRes.success) {
        setPayslips(payslipsRes.payslips || []);
        if (payslipsRes.summary) {
          setSummary(payslipsRes.summary);
        }
      }

      if (devsRes.success && devsRes.developers) {
        setDevelopers(devsRes.developers);
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to fetch payroll data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [selectedDevFilter, statusFilter]);

  // When developer selection changes, populate their rate/salary and currency
  const handleDeveloperSelect = (id: number) => {
    setDeveloperId(id);
    const dev = developers.find((d) => d.id === id);
    if (dev) {
      setCurrency(dev.currency || 'USD');
      if (dev.compensationType === 'salary') {
        setHourlyRate(0);
        setHoursBilled(1);
        setTotalAmount(round2(Number(dev.salary) || 0));
        setNotes(`Fixed Salary Disbursement (${dev.paytime || 'Monthly'})`);
      } else if (dev.compensationType === 'contract') {
        setHourlyRate(0);
        setHoursBilled(1);
        setTotalAmount(round2(Number(dev.contractAmount) || 0));
        setNotes(`Contract Payment Disbursement (${dev.paytime || 'Milestone'})`);
      } else {
        setHourlyRate(dev.hourlyRate || 45);
      }
    }
  };

  // Auto-Calculate total hours logged in date range
  const handleAutoCalculate = async () => {
    if (!developerId) {
      showToast('Please select a developer first', 'error');
      return;
    }
    if (!periodStart || !periodEnd) {
      showToast('Please select start and end dates', 'error');
      return;
    }

    setCalcLoading(true);
    const res = await developerService.adminCalculatePay(Number(developerId), periodStart, periodEnd);
    setCalcLoading(false);

    if (res.success) {
      const hours = res.hoursBilled || 0;
      const rate = res.hourlyRate || Number(hourlyRate) || 45;
      const basePay = hours * rate;
      const net = Math.max(0, basePay + (Number(bonus) || 0) - (Number(deductions) || 0));

      setHoursBilled(hours);
      setHourlyRate(rate);
      setTotalAmount(round2(net));
      if (res.currency) setCurrency(res.currency);
      showToast(`Calculated ${hours} hours from time tracking logs.`);
    } else {
      showToast(res.error || 'Failed to calculate hours', 'error');
    }
  };

  const round2 = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  // Recalculate total when hours, rate, bonus, deductions change
  useEffect(() => {
    const h = Number(hoursBilled) || 0;
    const r = Number(hourlyRate) || 0;
    const b = Number(bonus) || 0;
    const d = Number(deductions) || 0;
    const net = Math.max(0, h * r + b - d);
    setTotalAmount(round2(net));
  }, [hoursBilled, hourlyRate, bonus, deductions]);

  const handleOpenIssueModal = () => {
    setDeveloperId(developers.length > 0 ? developers[0].id : '');
    if (developers.length > 0) {
      setHourlyRate(developers[0].hourlyRate || 45);
      setCurrency(developers[0].currency || 'USD');
    }
    setHoursBilled(0);
    setBonus(0);
    setDeductions(0);
    setTotalAmount(0);
    setPaymentMethod('Bank Wire Transfer');
    setNotes('Engineering disbursement for completed milestones and logged hours.');
    setSendEmail(true);
    setModalOpen(true);
  };

  const handleIssuePayslip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!developerId) {
      showToast('Please select a developer', 'error');
      return;
    }

    setSaving(true);
    const res = await developerService.adminCreatePayslip({
      developerId: Number(developerId),
      periodStart,
      periodEnd,
      hoursBilled: Number(hoursBilled) || 0,
      hourlyRate: Number(hourlyRate) || 0,
      bonus: Number(bonus) || 0,
      deductions: Number(deductions) || 0,
      totalAmount: Number(totalAmount) || 0,
      currency,
      paymentMethod,
      notes,
      sendEmail
    });
    setSaving(false);

    if (res.success) {
      setModalOpen(false);
      showToast('Payslip issued and payment record created!');
      fetchAll();
    } else {
      showToast(res.error || 'Failed to issue payslip', 'error');
    }
  };

  const handleDeletePayslip = async (ps: Payslip) => {
    if (!window.confirm(`Delete voucher ${ps.referenceNo}?`)) return;
    const res = await developerService.adminDeletePayslip(ps.id);
    if (res.success) {
      showToast('Payslip deleted.');
      fetchAll();
    } else {
      showToast(res.error || 'Failed to delete payslip', 'error');
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" /> Payroll, Payslips & Disbursements
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Record engineering payments, calculate hours from logs, dispatch HTML payslips, and monitor developer confirmation receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => printAdminPayrollReport({ payslips, stats: { totalIssued: summary.totalPayslips, totalAmount: summary.totalAmount, confirmedCount: summary.confirmedCount, pendingCount: summary.pendingCount } })}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors shadow-sm"
            title="Print Master Statement (Clean Data)"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" /> Print Statement
          </button>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenIssueModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/25 transition-all"
          >
            <Plus className="w-4 h-4" /> Issue Payslip
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Total Disbursed</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            ${summary.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Issued Vouchers</span>
          <div className="text-2xl font-black text-white mt-1">{summary.totalPayslips}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Confirmed by Developer</span>
          <div className="text-2xl font-black text-sky-400 mt-1">{summary.confirmedCount}</div>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Pending Confirmation</span>
          <div className="text-2xl font-black text-amber-400 mt-1">{summary.pendingConfirmationCount}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Filter by Developer
          </label>
          <select
            value={selectedDevFilter}
            onChange={(e) => setSelectedDevFilter(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="">All Developers</option>
            {developers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.roleTitle})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Filter by Confirmation Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="issued">Pending Confirmation</option>
          </select>
        </div>
      </div>

      {/* Payslips Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Voucher Ref</th>
                <th className="py-3.5 px-5">Developer</th>
                <th className="py-3.5 px-5">Billing Period</th>
                <th className="py-3.5 px-5">Hours Billed</th>
                <th className="py-3.5 px-5">Total Paid</th>
                <th className="py-3.5 px-5">Method</th>
                <th className="py-3.5 px-5">Confirmation Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {payslips.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No payslips recorded yet. Click <strong>Issue Payslip</strong> above to record your first payment.
                  </td>
                </tr>
              ) : (
                payslips.map((ps) => (
                  <tr key={ps.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-5 text-white font-mono font-bold">{ps.referenceNo}</td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-white">{ps.developerName}</div>
                      <div className="text-[10px] text-slate-400">{ps.developerRole}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-300">
                      {ps.periodStart} → {ps.periodEnd}
                    </td>
                    <td className="py-4 px-5 text-slate-300">
                      {ps.hoursBilled} hrs @ {ps.currency} {ps.hourlyRate}/h
                    </td>
                    <td className="py-4 px-5 font-black text-emerald-400 text-sm">
                      {ps.currency} {Number(ps.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-5 text-slate-400">{ps.paymentMethod}</td>
                    <td className="py-4 px-5">
                      {ps.status === 'confirmed' ? (
                        <div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                            <Check className="w-3 h-3" /> Confirmed
                          </span>
                          {ps.confirmedAt && (
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {new Date(ps.confirmedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          Pending Confirmation
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => setSelectedPayslip(ps)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> View / Print
                      </button>
                      <button
                        onClick={() => handleDeletePayslip(ps)}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =======================================================================
          MODAL: ISSUE PAYSLIP
      ======================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <h3 className="text-lg font-black text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" /> Record Payment & Issue Payslip
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Calculate compensation from developer time logs or specify a custom disbursement voucher.
            </p>

            <form onSubmit={handleIssuePayslip} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Developer *
                </label>
                <select
                  required
                  value={developerId}
                  onChange={(e) => handleDeveloperSelect(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Choose Developer</option>
                  {developers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.roleTitle} (
                        {d.compensationType === 'salary'
                          ? `Salary: ${d.currency} ${Number(d.salary || 0).toLocaleString()} • ${d.paytime || 'Monthly'}`
                          : d.compensationType === 'contract'
                          ? `Contract: ${d.currency} ${Number(d.contractAmount || 0).toLocaleString()} • ${d.paytime || 'Milestone'}`
                          : `Hourly: ${d.currency} ${d.hourlyRate}/h • ${d.paytime || 'Hourly'}`}
                      )
                    </option>
                  ))}
                </select>
              </div>

              {developerId && (() => {
                const selDev = developers.find(d => d.id === Number(developerId));
                if (!selDev) return null;
                return (
                  <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      Staff Compensation Structure
                    </span>
                    <span className="font-bold">
                      {selDev.compensationType === 'salary' && (
                        <span className="text-amber-400">💼 Fixed Salary: {selDev.currency} {Number(selDev.salary || 0).toLocaleString()} ({selDev.paytime || 'Monthly'})</span>
                      )}
                      {selDev.compensationType === 'contract' && (
                        <span className="text-purple-400">📜 Paid on Contract: {selDev.currency} {Number(selDev.contractAmount || 0).toLocaleString()} ({selDev.paytime || 'Milestone'})</span>
                      )}
                      {(!selDev.compensationType || selDev.compensationType === 'hourly') && (
                        <span className="text-sky-400">⏱️ Hourly Rate: {selDev.currency} {Number(selDev.hourlyRate || 0).toFixed(2)}/hr ({selDev.paytime || 'Hourly'})</span>
                      )}
                    </span>
                  </div>
                );
              })()}

              {/* Date Range & Auto Calculate Button */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Billing Period
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoCalculate}
                    disabled={calcLoading || !developerId}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${calcLoading ? 'animate-spin' : ''}`} />
                    Auto-Calculate from Time Logs
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={periodStart}
                      onChange={(e) => setPeriodStart(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={periodEnd}
                      onChange={(e) => setPeriodEnd(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Itemized Numbers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Hours Billed
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={hoursBilled}
                    onChange={(e) => setHoursBilled(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Hourly Rate ({currency})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Bonus / Incentive (+)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value ? Number(e.target.value) : '')}
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Deductions (-)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value ? Number(e.target.value) : '')}
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-rose-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Net Disbursement Amount:</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {currency} {Number(totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Payment Method
                  </label>
                  <input
                    type="text"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    placeholder="e.g. Bank Wire / USDT / Direct Deposit"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="GHS">GHS (GH₵)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Voucher Memo / Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes on milestone deliverable or payment specifics..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(e) => setSendEmail(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-0"
                  />
                  <span className="text-xs text-slate-300">
                    Dispatch branded HTML payslip email voucher to developer with confirmation button
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {saving ? 'Issuing Payslip...' : 'Issue & Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL: OFFICIAL PRINTABLE VOUCHER
      ======================================================================= */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-8 shadow-2xl relative my-8 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 print:hidden">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disbursement Voucher</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => selectedPayslip && printSinglePayslipVoucher({ developer: null, payslip: selectedPayslip })}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                  title="Print Official Voucher (Clean Data)"
                >
                  <Printer className="w-4 h-4" /> Print Voucher
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div className="flex justify-between items-start border-b border-slate-800 pb-6 print:border-slate-300">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white print:text-black">
                    AZARIAH <span className="text-sky-400 print:text-blue-600">MANAGEMENT GROUP</span>
                  </h1>
                  <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                    Corporate Financial Operations & Payroll Disbursement
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 print:text-slate-600 uppercase">Voucher Ref</div>
                  <div className="text-base font-bold font-mono text-white print:text-black">{selectedPayslip.referenceNo}</div>
                  <div className="text-[11px] text-slate-500 print:text-slate-600 mt-1">
                    Issued: {formatLocalDate(selectedPayslip.issuedAt)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Disbursed To</div>
                  <div className="text-sm font-bold text-white print:text-black mt-0.5">{selectedPayslip.developerName}</div>
                  <div className="text-xs text-slate-400 print:text-slate-600">{selectedPayslip.developerEmail}</div>
                  <div className="text-xs text-sky-400 print:text-blue-600 font-medium">{selectedPayslip.developerRole}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Billing Period</div>
                  <div className="text-xs font-bold text-white print:text-black mt-0.5">
                    {selectedPayslip.periodStart} to {selectedPayslip.periodEnd}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-2">Payment Channel</div>
                  <div className="text-xs text-slate-300 print:text-slate-800">{selectedPayslip.paymentMethod}</div>
                </div>
              </div>

              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 print:bg-slate-100 print:text-black print:border-slate-300">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Hours</th>
                    <th className="p-3 text-right">Hourly Rate</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 print:divide-slate-200 text-slate-300 print:text-black">
                  <tr>
                    <td className="p-3 font-semibold">Approved Engineering Work Hours</td>
                    <td className="p-3 text-right">{selectedPayslip.hoursBilled} hrs</td>
                    <td className="p-3 text-right">{selectedPayslip.currency} {selectedPayslip.hourlyRate}</td>
                    <td className="p-3 text-right font-bold">
                      {selectedPayslip.currency} {(Number(selectedPayslip.hoursBilled) * Number(selectedPayslip.hourlyRate)).toFixed(2)}
                    </td>
                  </tr>
                  {Number(selectedPayslip.bonus) > 0 && (
                    <tr>
                      <td className="p-3 text-emerald-400 font-semibold">Performance Bonus / Milestone Incentive</td>
                      <td className="p-3 text-right">—</td>
                      <td className="p-3 text-right">—</td>
                      <td className="p-3 text-right text-emerald-400 font-bold">+{selectedPayslip.currency} {Number(selectedPayslip.bonus).toFixed(2)}</td>
                    </tr>
                  )}
                  {Number(selectedPayslip.deductions) > 0 && (
                    <tr>
                      <td className="p-3 text-rose-400 font-semibold">Withholdings / Deductions</td>
                      <td className="p-3 text-right">—</td>
                      <td className="p-3 text-right">—</td>
                      <td className="p-3 text-right text-rose-400 font-bold">-{selectedPayslip.currency} {Number(selectedPayslip.deductions).toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t-2 border-slate-800 print:border-slate-400">
                  <tr className="text-sm font-black text-white print:text-black">
                    <td colSpan={3} className="p-4 text-right uppercase tracking-wider">Total Disbursed Net</td>
                    <td className="p-4 text-right text-lg text-emerald-400 print:text-emerald-700 font-mono">
                      {selectedPayslip.currency} {Number(selectedPayslip.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {selectedPayslip.notes && (
                <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 print:bg-slate-50 print:border-slate-200 print:text-slate-700">
                  <strong className="text-slate-300 print:text-black">Voucher Memo:</strong> {selectedPayslip.notes}
                </div>
              )}

              <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex justify-between items-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Receipt Confirmation</div>
                  <div className="font-bold mt-0.5 text-emerald-400 print:text-emerald-700 flex items-center gap-1.5">
                    {selectedPayslip.status === 'confirmed' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Confirmed Received by Developer on {selectedPayslip.confirmedAt ? formatLocalDate(selectedPayslip.confirmedAt) : 'Active'}</span>
                      </>
                    ) : (
                      <span className="text-amber-400">Pending Developer Receipt Confirmation</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="w-44 border-b border-slate-600 print:border-black mb-1" />
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Authorized Signature</div>
                  <div className="text-[10px] text-slate-400">Azariah Management Group Executive</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayrollTab;
