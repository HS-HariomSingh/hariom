import React from 'react';
import { LostFoundItem, CurrentUser } from '../types';
import { ItemCard } from './ItemCard';
import {
  Search,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Building2
} from 'lucide-react';

interface HeroSectionProps {
  lostItems: LostFoundItem[];
  foundItems: LostFoundItem[];
  currentUser: CurrentUser | null;
  onOpenReportModal: (type: 'LOST' | 'FOUND') => void;
  onViewDetails: (item: LostFoundItem) => void;
  onClaimItem: (item: LostFoundItem) => void;
  onNavigate: (view: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lostItems,
  foundItems,
  currentUser,
  onOpenReportModal,
  onViewDetails,
  onClaimItem,
  onNavigate,
}) => {
  return (
    <div className="space-y-12">
      {/* College Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-900/60 border border-indigo-500/30 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>IIIT Bhopal Campus Lost &amp; Found Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Lost Something? <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-sky-300 to-indigo-100">
              Found Something?
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Help reunite lost belongings with their owners across the campus. Submit reports, verify items, and file claims backed by our relational DBMS system.
          </p>

          {/* Two Major Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenReportModal('LOST')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-900/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5 text-amber-100" />
              <span>Report Lost Item</span>
            </button>

            <button
              onClick={() => onOpenReportModal('FOUND')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-950/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer border border-indigo-400/30"
            >
              <CheckCircle2 className="w-5 h-5 text-indigo-200" />
              <span>Report Found Item</span>
            </button>
          </div>

          {/* Campus Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800 text-left">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-center">
              <span className="block text-2xl font-black text-amber-400">{lostItems.length}</span>
              <span className="text-[11px] text-slate-400 font-medium">Lost Reports</span>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-center">
              <span className="block text-2xl font-black text-emerald-400">{foundItems.length}</span>
              <span className="text-[11px] text-slate-400 font-medium">Found Items</span>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-center">
              <span className="block text-2xl font-black text-sky-400">100%</span>
              <span className="text-[11px] text-slate-400 font-medium">Proctor Verified</span>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 text-center">
              <span className="block text-2xl font-black text-indigo-300">Live</span>
              <span className="text-[11px] text-slate-400 font-medium">Firebase + MySQL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Recently Lost Items */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Recently Lost Items
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Articles reported misplaced by students in campus facilities.
            </p>
          </div>
          <button
            onClick={() => onNavigate('browse-lost')}
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>View All Lost ({lostItems.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {lostItems.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
            No lost items currently recorded.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {lostItems.slice(0, 4).map((item) => (
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
      </section>

      {/* Section 2: Recently Found Items */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Recently Found Items
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Recovered belongings deposited with the proctorial authority or cafeteria.
            </p>
          </div>
          <button
            onClick={() => onNavigate('browse-found')}
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>View All Found ({foundItems.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {foundItems.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
            No found items currently recorded.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {foundItems.slice(0, 4).map((item) => (
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
      </section>
    </div>
  );
};
