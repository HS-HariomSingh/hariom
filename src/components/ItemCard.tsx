import React from 'react';
import { LostFoundItem, CurrentUser } from '../types';
import {
  MapPin,
  Calendar,
  Tag,
  Eye,
  HandHelping,
  CheckCircle2,
  Clock,
  AlertCircle,
  CheckCheck
} from 'lucide-react';

interface ItemCardProps {
  item: LostFoundItem;
  currentUser: CurrentUser | null;
  onViewDetails: (item: LostFoundItem) => void;
  onClaimItem: (item: LostFoundItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  currentUser,
  onViewDetails,
  onClaimItem,
}) => {
  const isFound = item.type === 'FOUND';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
      case 'CLAIMED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <CheckCheck className="w-3 h-3" /> Claimed
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Thumbnail or Category Header */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback image if external URL fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <Tag className="w-10 h-10 mb-1 opacity-50" />
            <span className="text-xs font-medium uppercase tracking-wider">{item.category}</span>
          </div>
        )}

        {/* Floating Type Badge */}
        <div className="absolute top-3 left-3 flex gap-1.5 items-center">
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs ${
              isFound
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            {item.type}
          </span>
          <span className="text-[11px] font-medium bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
            {item.category}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {getStatusBadge(item.status)}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {item.title}
          </h3>

          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{item.date_incident}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onViewDetails(item)}
            className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Details</span>
          </button>

          {isFound && item.status === 'APPROVED' && (
            <button
              onClick={() => onClaimItem(item)}
              className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1"
            >
              <HandHelping className="w-3.5 h-3.5 text-emerald-100" />
              <span>Claim Item</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
