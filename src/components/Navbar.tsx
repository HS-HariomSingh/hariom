import React from 'react';
import { CurrentUser } from '../types';
import {
  Search,
  ShieldCheck,
  UserCheck,
  LogOut,
  FolderKanban,
  FileText,
  Compass,
  PlusCircle,
  HelpCircle,
  Database
} from 'lucide-react';

interface NavbarProps {
  currentUser: CurrentUser | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenStudentLogin: () => void;
  onOpenAdminLogin: () => void;
  onOpenReportModal: (type: 'LOST' | 'FOUND') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenStudentLogin,
  onOpenAdminLogin,
  onOpenReportModal,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top emergency / campus notice bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs flex justify-between items-center font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>IIIT Bhopal Campus Security & Proctorial Board Portal</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Official DBMS Course Project</span>
          <span className="hidden sm:inline">Proctor Helpdesk: Room 102, Admin Block</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & College Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-lg tracking-tight flex items-center gap-1.5">
                Lost &amp; Found
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                  Campus DBMS
                </span>
              </div>
              <p className="text-xs text-slate-500">Student &amp; Proctorial Management</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-slate-100 text-indigo-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('browse-lost')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'browse-lost'
                  ? 'bg-slate-100 text-amber-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Lost Items
            </button>
            <button
              onClick={() => onNavigate('browse-found')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'browse-found'
                  ? 'bg-slate-100 text-emerald-600 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Found Items
            </button>
            <button
              onClick={() => onNavigate('dbms-lab')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'dbms-lab'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Database className="w-4 h-4 text-indigo-500" />
              DBMS Lab &amp; SQL
            </button>
            <button
              onClick={() => onNavigate('docs')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                currentView === 'docs'
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-500" />
              Project Report
            </button>
          </nav>

          {/* Action & User Profile Buttons */}
          <div className="flex items-center gap-2">
            {currentUser?.type === 'student' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('student-dashboard')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                    currentView === 'student-dashboard'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{currentUser.student?.name} (Portal)</span>
                </button>
                <button
                  onClick={() => onOpenReportModal('LOST')}
                  className="hidden lg:flex px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Report Lost
                </button>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : currentUser?.type === 'admin' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 ${
                    currentView === 'admin-dashboard'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Hariom (Chief Proctor)</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenStudentLogin}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Student Login
                </button>
                <button
                  onClick={onOpenAdminLogin}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
                  Admin Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
