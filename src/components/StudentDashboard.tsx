import React, { useState } from 'react';
import { LostFoundItem, ItemClaim, Student, CurrentUser } from '../types';
import { ItemCard } from './ItemCard';
import {
  UserCheck,
  PlusCircle,
  FolderOpen,
  HandHelping,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  MapPin,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface StudentDashboardProps {
  student: Student;
  items: LostFoundItem[];
  claims: ItemClaim[];
  currentUser: CurrentUser;
  onOpenReportModal: (type: 'LOST' | 'FOUND') => void;
  onViewDetails: (item: LostFoundItem) => void;
  onClaimItem: (item: LostFoundItem) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  items,
  claims,
  currentUser,
  onOpenReportModal,
  onViewDetails,
  onClaimItem,
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'available-found' | 'claims'>('reports');

  // Filter items reported by this student
  const myReports = items.filter((i) => i.student_id === student.student_id);
  const myLostReports = myReports.filter((i) => i.type === 'LOST');
  const myFoundReports = myReports.filter((i) => i.type === 'FOUND');
  const myResolvedReports = myReports.filter(
    (i) => i.status === 'RESOLVED' || i.status === 'CLAIMED'
  );

  // Available found items (reported by anyone, type FOUND, status APPROVED)
  const availableFoundItems = items.filter(
    (i) => i.type === 'FOUND' && i.status === 'APPROVED' && i.student_id !== student.student_id
  );

  // Claims filed by this student
  const myClaims = claims.filter((c) => c.student_id === student.student_id);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome & Student Profile Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-indigo-700/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/20">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Verified Student Session</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Welcome back, {student.name}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200">
              {student.department} &bull; {student.year} &bull; Roll:{' '}
              <span className="font-mono font-bold text-white">{student.roll_number}</span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onOpenReportModal('LOST')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Lost Item</span>
            </button>
            <button
              onClick={() => onOpenReportModal('FOUND')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white shadow-xs transition-colors flex items-center gap-1.5 border border-indigo-400/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Found Item</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 mt-6 border-t border-indigo-700/40">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-indigo-200 font-medium block">Total Reports</span>
            <span className="text-2xl font-black text-white">{myReports.length}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-amber-300 font-medium block">Lost Reports</span>
            <span className="text-2xl font-black text-amber-400">{myLostReports.length}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-emerald-300 font-medium block">Found Reports</span>
            <span className="text-2xl font-black text-emerald-400">{myFoundReports.length}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-sky-300 font-medium block">Resolved</span>
            <span className="text-2xl font-black text-sky-400">{myResolvedReports.length}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-[11px] text-purple-300 font-medium block">My Claims</span>
            <span className="text-2xl font-black text-purple-300">{myClaims.length}</span>
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
          <FolderOpen className="w-4 h-4" />
          <span>My Submitted Reports ({myReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('available-found')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'available-found'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HandHelping className="w-4 h-4" />
          <span>Available Found Items ({availableFoundItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'claims'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Claims Status ({myClaims.length})</span>
        </button>
      </div>

      {/* Tab 1: My Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-slate-900">Articles You Reported</h2>
            <div className="flex gap-2">
              <button
                onClick={() => onOpenReportModal('LOST')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
              >
                + New Lost Report
              </button>
              <button
                onClick={() => onOpenReportModal('FOUND')}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                + New Found Report
              </button>
            </div>
          </div>

          {myReports.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No reports submitted yet.</p>
              <p className="text-xs text-slate-500">
                If you misplaced an item or found someone's belonging, click the buttons above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Report ID</th>
                    <th className="py-3 px-4">Item Title</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Verification Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {myReports.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.title}</td>
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4">{item.category}</td>
                      <td className="py-3 px-4">{item.location}</td>
                      <td className="py-3 px-4 text-slate-500">{item.date_incident}</td>
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewDetails(item)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Available Found Items for Claiming */}
      {activeTab === 'available-found' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Found Belongings Deposited on Campus</h2>
            <p className="text-xs text-slate-500">
              Browse approved items. If an article belongs to you, submit an ownership claim with identifying proof.
            </p>
          </div>

          {availableFoundItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              No unclaimed found items available currently.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableFoundItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  currentUser={currentUser}
                  onViewDetails={onViewDetails}
                  onClaimItem={onClaimItem}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Claims Status */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">My Ownership Claims</h2>
            <p className="text-xs text-slate-500">
              Track verification decisions made by Proctor Hariom on your submitted proof.
            </p>
          </div>

          {myClaims.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No ownership claims filed.</p>
              <p className="text-xs text-slate-500">
                When you see your lost item in the Found catalog, click "Claim Item" to submit ownership proof.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Claim ID</th>
                    <th className="py-3 px-4">Item Claimed</th>
                    <th className="py-3 px-4">Proof Provided</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Proctor Remarks</th>
                    <th className="py-3 px-4">Filed On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {myClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{claim.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {claim.item_title || `Item ${claim.item_id}`}
                      </td>
                      <td className="py-3 px-4 max-w-xs text-slate-600 truncate" title={claim.reason_proof}>
                        {claim.reason_proof}
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
                          {claim.status === 'REJECTED' && <AlertCircle className="w-3 h-3" />}
                          {claim.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 italic">
                        {claim.admin_notes || 'Pending proctor review'}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {claim.created_at ? claim.created_at.split('T')[0] : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
