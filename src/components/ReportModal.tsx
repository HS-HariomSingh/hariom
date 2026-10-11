import React, { useState } from 'react';
import { LostFoundItem, CurrentUser, ItemCategory, ItemType } from '../types';
import { X, Upload, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  type: ItemType;
  currentUser: CurrentUser | null;
  onClose: () => void;
  onSubmit: (reportData: Partial<LostFoundItem>) => Promise<void>;
  onPromptLogin: () => void;
}

const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'Documents',
  'Books',
  'Accessories',
  'ID Cards',
  'Bags',
  'Clothing',
  'Other',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  type,
  currentUser,
  onClose,
  onSubmit,
  onPromptLogin,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateIncident, setDateIncident] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentUser || currentUser.type !== 'student') {
      setError('Please log in as a student (Arth or Shivam) to submit this report.');
      return;
    }

    if (!title.trim() || !description.trim() || !location.trim() || !dateIncident) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        category,
        description: description.trim(),
        type,
        location: location.trim(),
        date_incident: dateIncident,
        image_url: imageUrl.trim() || undefined,
        status: 'PENDING',
        student_id: currentUser.student?.student_id || 'STU-ARTH',
        student_name: currentUser.student?.name || 'Arth',
        student_email: currentUser.student?.email || 'arth@iiitbhopal.ac.in',
      });
      // reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setImageUrl('');
      onClose();
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`p-5 flex items-center justify-between text-white ${
          type === 'LOST'
            ? 'bg-gradient-to-r from-amber-600 to-amber-700'
            : 'bg-gradient-to-r from-indigo-600 to-indigo-700'
        }`}>
          <div>
            <h2 className="text-lg font-bold">
              {type === 'LOST' ? 'Report a Lost Item' : 'Report a Found Item'}
            </h2>
            <p className="text-xs text-white/80 mt-0.5">
              {type === 'LOST'
                ? 'File an official report so campus community can help locate it'
                : 'Deposit record for an item recovered on campus premises'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!currentUser || currentUser.type !== 'student' ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm space-y-3 text-center">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
              <p className="font-semibold">Student Login Required</p>
              <p className="text-xs text-amber-700">
                You must be logged in as a registered student (Arth or Shivam) to file a verified report into the database.
              </p>
              <button
                onClick={onPromptLogin}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Log In as Student
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs flex justify-between items-center text-slate-600">
                <span>Filing as Student:</span>
                <span className="font-bold text-slate-800">
                  {currentUser.student?.name} ({currentUser.student?.roll_number})
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Casio Scientific Calculator, Blue Water Bottle..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ItemCategory)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {type === 'LOST' ? 'Date Lost *' : 'Date Found *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={dateIncident}
                    onChange={(e) => setDateIncident(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {type === 'LOST' ? 'Location Where Lost *' : 'Location Where Found *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central Library - 2nd Floor, Nescafe Cafeteria, Room 204..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe color, brand, stickers, unique identification marks, scratches, or contents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Optional Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/item-photo.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  You can paste an Unsplash or hosted photo link for reference.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2 text-xs font-bold rounded-lg text-white shadow-xs transition-colors flex items-center gap-1.5 ${
                    type === 'LOST'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } disabled:opacity-50`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
