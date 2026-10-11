import React from 'react';
import { LostFoundItem, CurrentUser } from '../types';
import {
  X,
  MapPin,
  Calendar,
  Tag,
  User,
  Mail,
  HandHelping,
  CheckCircle2,
  Clock,
  CheckCheck,
  AlertCircle
} from 'lucide-react';

interface ItemDetailsModalProps {
  item: LostFoundItem | null;
  currentUser: CurrentUser | null;
  onClose: () => void;
  onClaim: (item: LostFoundItem) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  currentUser,
  onClose,
  onClaim,
}) => {
  if (!item) return null;

  const isFound = item.type === 'FOUND';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with image */}
        <div className="relative bg-slate-900 text-white">
          {item.image_url ? (
            <div className="h-56 w-full relative">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-r from-slate-800 to-indigo-950 p-6 flex items-center">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">
                  Campus Article Details
                </span>
                <h2 className="text-xl font-extrabold text-white">{item.title}</h2>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                  isFound ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}
              >
                {item.type}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-xs text-white">
                {item.category}
              </span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-800 text-white border border-slate-700">
              Status: {item.status}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              <div>
                <span className="block text-slate-400 font-medium">Location</span>
                <span className="font-semibold text-slate-800">{item.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
              <div>
                <span className="block text-slate-400 font-medium">Incident Date</span>
                <span className="font-semibold text-slate-800">{item.date_incident}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500 shrink-0" />
              <div>
                <span className="block text-slate-400 font-medium">Reported By</span>
                <span className="font-semibold text-slate-800">
                  {item.student_name || 'Registered Student'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-500 shrink-0" />
              <div>
                <span className="block text-slate-400 font-medium">Report ID</span>
                <span className="font-mono font-semibold text-slate-800">{item.id}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            {isFound && item.status === 'APPROVED' && (
              <button
                onClick={() => {
                  onClose();
                  onClaim(item);
                }}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <HandHelping className="w-4 h-4" />
                <span>Submit Claim</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
