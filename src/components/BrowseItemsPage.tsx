import React, { useState } from 'react';
import { LostFoundItem, CurrentUser, ItemCategory } from '../types';
import { ItemCard } from './ItemCard';
import { Search, Filter, Layers, PlusCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface BrowseItemsPageProps {
  items: LostFoundItem[];
  currentUser: CurrentUser | null;
  initialTypeFilter?: 'ALL' | 'LOST' | 'FOUND';
  onViewDetails: (item: LostFoundItem) => void;
  onClaimItem: (item: LostFoundItem) => void;
  onOpenReportModal: (type: 'LOST' | 'FOUND') => void;
}

const CATEGORIES: ('All' | ItemCategory)[] = [
  'All',
  'Electronics',
  'Documents',
  'Books',
  'Accessories',
  'ID Cards',
  'Bags',
  'Clothing',
  'Other',
];

export const BrowseItemsPage: React.FC<BrowseItemsPageProps> = ({
  items,
  currentUser,
  initialTypeFilter = 'ALL',
  onViewDetails,
  onClaimItem,
  onOpenReportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'LOST' | 'FOUND'>(initialTypeFilter);
  const [categoryFilter, setCategoryFilter] = useState<'All' | ItemCategory>('All');
  const [statusFilter, setStatusFilter] = useState<string>('APPROVED'); // Default to approved for clean student browsing

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-600" />
            <span>Campus Lost &amp; Found Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse through items reported lost or found across college departments and hostels.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onOpenReportModal('LOST')}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Report Lost
          </button>
          <button
            onClick={() => onOpenReportModal('FOUND')}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Report Found
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by keywords, item title, campus location, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        {/* Filter Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          {/* Type filters */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Type:</span>
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                typeFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Items ({items.length})
            </button>
            <button
              onClick={() => setTypeFilter('LOST')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                typeFilter === 'LOST'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Lost Only ({items.filter((i) => i.type === 'LOST').length})
            </button>
            <button
              onClick={() => setTypeFilter('FOUND')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                typeFilter === 'FOUND'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Found Only ({items.filter((i) => i.type === 'FOUND').length})
            </button>
          </div>

          {/* Category Dropdown & Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:ring-1 focus:ring-indigo-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <span className="text-slate-400 font-bold uppercase text-[10px] ml-1">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved Public</option>
              <option value="CLAIMED">Claimed</option>
              <option value="RESOLVED">Resolved</option>
              <option value="PENDING">Pending Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      <div>
        <div className="flex justify-between items-center mb-4 text-xs text-slate-500">
          <span>Showing {filteredItems.length} matching articles</span>
          {(searchQuery || typeFilter !== 'ALL' || categoryFilter !== 'All' || statusFilter !== 'APPROVED') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('ALL');
                setCategoryFilter('All');
                setStatusFilter('APPROVED');
              }}
              className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Matching Articles Found</h3>
            <p className="text-xs max-w-sm mx-auto text-slate-500">
              Try adjusting your search keywords, category filters, or switch to view all items.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => (
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
    </div>
  );
};
