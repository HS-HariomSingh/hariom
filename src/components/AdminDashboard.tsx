import React, { useState } from 'react';
import { LostFoundItem, ItemClaim, Student, Admin } from '../types';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  CheckCheck,
  Trash2,
  Users,
  Package,
  Clock,
  AlertCircle,
  FileCheck,
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';

interface AdminDashboardProps {
  admin: Admin;
  items: LostFoundItem[];
  claims: ItemClaim[];
  students: Student[];
  onApproveItem: (itemId: string) => Promise<void>;
  onRejectItem: (itemId: string) => Promise<void>;
  onResolveItem: (itemId: string) => Promise<void>;
  onDeleteItem: (itemId: string) => Promise<void>;
  onApproveClaim: (claimId: string) => Promise<void>;
  onRejectClaim: (claimId: string) => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  admin,
  items,
  claims,
  students,
  onApproveItem,
  onRejectItem,
  onResolveItem,
  onDeleteItem,
  onApproveClaim,
  onRejectClaim,
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'claims' | 'students'>('reports');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Compute stats as requested in Section 11
  const totalStudents = students.length;
  const totalItems = items.length;
  const lostItemsCount = items.filter((i) => i.type === 'LOST').length;
  const foundItemsCount = items.filter((i) => i.type === 'FOUND').length;
  const pendingReportsCount = items.filter((i) => i.status === 'PENDING').length;
  const resolvedItemsCount = items.filter(
    (i) => i.status === 'RESOLVED' || i.status === 'CLAIMED'
  ).length;
  const pendingClaimsCount = claims.filter((c) => c.status === 'PENDING').length;

  // Filtered reports
  const filteredItems = items.filter((item) => {
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.student_name && item.student_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleAction = async (id: string, actionFn: () => Promise<void>) => {
    try {
      setActionLoadingId(id);
      await actionFn();
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Admin Command Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/20">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Proctorial Administration Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Admin Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Logged in as <strong className="text-white">{admin.name}</strong> ({admin.role}) &bull;{' '}
              {admin.email}
            </p>
          </div>
        </div>

        {/* 7 KPI Metric Cards as requested in Section 11 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-6 mt-6 border-t border-slate-800 text-center">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Total Students
            </span>
            <span className="text-2xl font-black text-white">{totalStudents}</span>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Total Items
            </span>
            <span className="text-2xl font-black text-indigo-300">{totalItems}</span>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60">
            <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
              Lost Items
            </span>
            <span className="text-2xl font-black text-amber-400">{lostItemsCount}</span>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60">
            <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">
              Found Items
            </span>
            <span className="text-2xl font-black text-emerald-400">{foundItemsCount}</span>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60">
            <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
              Pending Reports
            </span>
            <span className="text-2xl font-black text-amber-400">{pendingReportsCount}</span>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60">
            <span className="text-[10px] uppercase tracking-wider text-sky-300 font-bold block">
              Resolved Items
            </span>
            <span className="text-2xl font-black text-sky-400">{resolvedItemsCount}</span>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase tracking-wider text-rose-300 font-bold block">
              Pending Claims
            </span>
            <span className="text-2xl font-black text-rose-400">{pendingClaimsCount}</span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Reports Management ({items.length})</span>
          {pendingReportsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              {pendingReportsCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'claims'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Claims Review ({claims.length})</span>
          {pendingClaimsCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
              {pendingClaimsCount} pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'students'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Students Directory ({students.length})</span>
        </button>
      </div>

      {/* TAB 1: REPORTS TABLE */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, location, student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-hidden text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-slate-500 font-medium">Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1"
              >
                <option value="ALL">All Types</option>
                <option value="LOST">Lost</option>
                <option value="FOUND">Found</option>
              </select>

              <label className="text-slate-500 font-medium ml-2">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="CLAIMED">Claimed</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Item Title</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.id}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold block text-slate-900">
                        {item.student_name || 'Student'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.student_id}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 max-w-[180px] truncate" title={item.title}>
                      {item.title}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.type === 'LOST'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-3">{item.category}</td>
                    <td className="py-3 px-3 text-slate-600">{item.location}</td>
                    <td className="py-3 px-3 text-slate-500">{item.date_incident}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : item.status === 'CLAIMED'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : item.status === 'RESOLVED'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleAction(item.id, () => onApproveItem(item.id))}
                              disabled={actionLoadingId === item.id}
                              title="Approve Report"
                              className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold border border-emerald-200 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(item.id, () => onRejectItem(item.id))}
                              disabled={actionLoadingId === item.id}
                              title="Reject Report"
                              className="px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold border border-rose-200 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {item.status === 'APPROVED' && (
                          <button
                            onClick={() => handleAction(item.id, () => onResolveItem(item.id))}
                            disabled={actionLoadingId === item.id}
                            title="Mark Resolved"
                            className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold border border-blue-200 transition-colors"
                          >
                            Resolve
                          </button>
                        )}

                        <button
                          onClick={() => handleAction(item.id, () => onDeleteItem(item.id))}
                          disabled={actionLoadingId === item.id}
                          title="Delete Report"
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CLAIMS REVIEW TABLE */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Claim ID</th>
                  <th className="py-3 px-4">Found Item</th>
                  <th className="py-3 px-4">Claimant Student</th>
                  <th className="py-3 px-4">Ownership Proof Provided</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{claim.id}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {claim.item_title || `Item ${claim.item_id}`}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold block text-slate-900">{claim.student_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{claim.student_id}</span>
                    </td>
                    <td className="py-3 px-4 max-w-sm text-slate-600">
                      <p className="line-clamp-2" title={claim.reason_proof}>
                        {claim.reason_proof}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          claim.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : claim.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {claim.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                        {claim.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {claim.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAction(claim.id, () => onApproveClaim(claim.id))}
                            disabled={actionLoadingId === claim.id}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-2xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(claim.id, () => onRejectClaim(claim.id))}
                            disabled={actionLoadingId === claim.id}
                            className="px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Decision Recorded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENTS DIRECTORY */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Academic Year</th>
                  <th className="py-3 px-4">Roll Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {students.map((stu) => (
                  <tr key={stu.student_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{stu.student_id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{stu.name}</td>
                    <td className="py-3 px-4 font-mono text-indigo-600">{stu.email}</td>
                    <td className="py-3 px-4">{stu.department}</td>
                    <td className="py-3 px-4">{stu.year}</td>
                    <td className="py-3 px-4 font-mono font-semibold">{stu.roll_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
