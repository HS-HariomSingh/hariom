import React, { useState } from 'react';
import { Student, Admin } from '../types';
import { X, UserCheck, ShieldCheck, KeyRound, Mail, AlertCircle, Sparkles } from 'lucide-react';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (student: Student) => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailTrim = email.trim().toLowerCase();
    if (emailTrim === 'arth@iiitbhopal.ac.in' && password === 'student123') {
      onLoginSuccess({
        student_id: 'STU-ARTH',
        name: 'Arth',
        email: 'arth@iiitbhopal.ac.in',
        department: 'Computer Science and Engineering',
        year: '3rd Year',
        roll_number: '2023CSE015',
        phone: '+91 9876543210',
      });
      onClose();
    } else if (emailTrim === 'shivam@iiitbhopal.ac.in' && password === 'student123') {
      onLoginSuccess({
        student_id: 'STU-SHIVAM',
        name: 'Shivam',
        email: 'shivam@iiitbhopal.ac.in',
        department: 'Information Technology',
        year: '2nd Year',
        roll_number: '2024IT042',
        phone: '+91 9812345678',
      });
      onClose();
    } else {
      setError('Invalid student email or password. Only dummy students Arth and Shivam are registered.');
    }
  };

  const handleQuickStudentLogin = (who: 'arth' | 'shivam') => {
    if (who === 'arth') {
      onLoginSuccess({
        student_id: 'STU-ARTH',
        name: 'Arth',
        email: 'arth@iiitbhopal.ac.in',
        department: 'Computer Science and Engineering',
        year: '3rd Year',
        roll_number: '2023CSE015',
        phone: '+91 9876543210',
      });
    } else {
      onLoginSuccess({
        student_id: 'STU-SHIVAM',
        name: 'Shivam',
        email: 'shivam@iiitbhopal.ac.in',
        department: 'Information Technology',
        year: '2nd Year',
        roll_number: '2024IT042',
        phone: '+91 9812345678',
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-200" />
            <h2 className="text-base font-bold">Student Portal Login</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick 1-Click Login for Dummy Students */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Demo Credentials (Quick Login)
              </span>
              <span className="text-[10px] text-indigo-600 font-medium">Arth &amp; Shivam only</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickStudentLogin('arth')}
                className="px-3 py-2 bg-white hover:bg-indigo-100/70 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-semibold text-left transition-colors shadow-2xs"
              >
                <span className="block font-bold">Arth</span>
                <span className="text-[10px] text-slate-500">arth@iiitbhopal.ac.in</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickStudentLogin('shivam')}
                className="px-3 py-2 bg-white hover:bg-indigo-100/70 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-semibold text-left transition-colors shadow-2xs"
              >
                <span className="block font-bold">Shivam</span>
                <span className="text-[10px] text-slate-500">shivam@iiitbhopal.ac.in</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-slate-400 text-xs uppercase font-medium">Or enter manually</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="arth@iiitbhopal.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="student123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs transition-colors mt-2"
            >
              Sign In to Student Portal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (admin: Admin) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailTrim = email.trim().toLowerCase();
    if (emailTrim === 'hariom@iiitbhopal.ac.in' && password === 'admin123') {
      onLoginSuccess({
        admin_id: 'ADM-HARIOM',
        name: 'Hariom',
        email: 'hariom@iiitbhopal.ac.in',
        role: 'Chief Proctor / Admin',
      });
      onClose();
    } else {
      setError('Invalid administrator credentials. Only dummy admin Hariom is provisioned.');
    }
  };

  const handleQuickAdminLogin = () => {
    onLoginSuccess({
      admin_id: 'ADM-HARIOM',
      name: 'Hariom',
      email: 'hariom@iiitbhopal.ac.in',
      role: 'Chief Proctor / Admin',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold">Admin Authority Portal</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick 1-Click Login for Dummy Admin Hariom */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Demo Admin Account
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Hariom only</span>
            </div>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="w-full px-3 py-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg text-xs font-semibold text-left transition-colors flex justify-between items-center shadow-2xs"
            >
              <div>
                <span className="block font-bold">Hariom (Chief Proctor)</span>
                <span className="text-[10px] text-slate-500">hariom@iiitbhopal.ac.in</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                1-Click Sign In
              </span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-slate-400 text-xs uppercase font-medium">Or enter credentials</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Proctor Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="hariom@iiitbhopal.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="admin123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs transition-colors mt-2"
            >
              Sign In to Admin Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
