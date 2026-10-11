/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import {
  db,
  testConnection,
  handleFirestoreError,
  OperationType,
  INITIAL_STUDENTS,
  INITIAL_ADMINS,
  INITIAL_ITEMS,
  INITIAL_CLAIMS
} from './firebase';
import {
  LostFoundItem,
  ItemClaim,
  Student,
  Admin,
  CurrentUser,
  ItemType
} from './types';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BrowseItemsPage } from './components/BrowseItemsPage';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DbmsWorkbench } from './components/DbmsWorkbench';
import { DocsView } from './components/DocsView';
import { ReportModal } from './components/ReportModal';
import { ClaimModal } from './components/ClaimModal';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { StudentLoginModal, AdminLoginModal } from './components/AuthModals';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation & session state
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Live Database state
  const [items, setItems] = useState<LostFoundItem[]>(INITIAL_ITEMS);
  const [claims, setClaims] = useState<ItemClaim[]>(INITIAL_CLAIMS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [admins, setAdmins] = useState<Admin[]>(INITIAL_ADMINS);
  const [dbReady, setDbReady] = useState(false);

  // Modals state
  const [isStudentLoginOpen, setIsStudentLoginOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [reportModalState, setReportModalState] = useState<{
    isOpen: boolean;
    type: ItemType;
  }>({ isOpen: false, type: 'LOST' });
  const [selectedClaimItem, setSelectedClaimItem] = useState<LostFoundItem | null>(null);
  const [selectedDetailsItem, setSelectedDetailsItem] = useState<LostFoundItem | null>(null);

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Initial Firestore Boot & Seed Initialization
  useEffect(() => {
    const initializeDb = async () => {
      try {
        await testConnection();

        // Check if items collection already has records
        const itemsSnap = await getDocs(collection(db, 'items'));
        if (itemsSnap.empty) {
          console.log('[Firestore] Seeding initial campus dataset...');

          // Seed Students (Arth & Shivam)
          for (const s of INITIAL_STUDENTS) {
            await setDoc(doc(db, 'students', s.student_id), s);
          }

          // Seed Admin (Hariom)
          for (const a of INITIAL_ADMINS) {
            await setDoc(doc(db, 'admins', a.admin_id), a);
          }

          // Seed Items
          for (const itm of INITIAL_ITEMS) {
            await setDoc(doc(db, 'items', itm.id), itm);
          }

          // Seed Claims
          for (const clm of INITIAL_CLAIMS) {
            await setDoc(doc(db, 'item_claims', clm.id), clm);
          }
        }
      } catch (err) {
        console.warn('[Firestore] Using in-memory fallback state if offline:', err);
      } finally {
        setDbReady(true);
      }
    };

    initializeDb();
  }, []);

  // 2. Real-Time Listeners to Sync Firestore
  useEffect(() => {
    // Listen to Items
    const unsubItems = onSnapshot(
      collection(db, 'items'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: LostFoundItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as LostFoundItem);
          });
          setItems(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'items');
      }
    );

    // Listen to Claims
    const unsubClaims = onSnapshot(
      collection(db, 'item_claims'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ItemClaim[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as ItemClaim);
          });
          setClaims(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'item_claims');
      }
    );

    // Listen to Students
    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Student[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Student);
          });
          setStudents(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'students');
      }
    );

    return () => {
      unsubItems();
      unsubClaims();
      unsubStudents();
    };
  }, []);

  // ---------------- Handlers ----------------

  // Report submission
  const handleSubmitReport = async (reportData: Partial<LostFoundItem>) => {
    const newId = `ITEM-${Date.now().toString(36).toUpperCase()}`;
    const newItem: LostFoundItem = {
      id: newId,
      item_id: newId,
      title: reportData.title || '',
      category: reportData.category || 'Other',
      description: reportData.description || '',
      type: reportData.type || 'LOST',
      status: 'PENDING',
      location: reportData.location || '',
      date_incident: reportData.date_incident || new Date().toISOString().split('T')[0],
      image_url: reportData.image_url,
      student_id: currentUser?.student?.student_id || 'STU-ARTH',
      student_name: currentUser?.student?.name || 'Arth',
      student_email: currentUser?.student?.email || 'arth@iiitbhopal.ac.in',
      created_at: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'items', newId), newItem);
      // update local state optimistically
      setItems((prev) => [newItem, ...prev]);
      showToast(
        `${newItem.type === 'LOST' ? 'Lost' : 'Found'} report submitted! Pending proctor verification.`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `items/${newId}`);
    }
  };

  // Claim submission
  const handleSubmitClaim = async (claimData: Partial<ItemClaim>) => {
    const newClaimId = `CLM-${Date.now().toString(36).toUpperCase()}`;
    const newClaim: ItemClaim = {
      id: newClaimId,
      claim_id: newClaimId,
      item_id: claimData.item_id || '',
      item_title: claimData.item_title,
      student_id: currentUser?.student?.student_id || 'STU-ARTH',
      student_name: currentUser?.student?.name || 'Arth',
      student_email: currentUser?.student?.email || 'arth@iiitbhopal.ac.in',
      reason_proof: claimData.reason_proof || '',
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'item_claims', newClaimId), newClaim);
      setClaims((prev) => [newClaim, ...prev]);
      showToast('Claim submitted successfully! Proctor Hariom will review your proof.');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `item_claims/${newClaimId}`);
    }
  };

  // Admin: Approve Item
  const handleApproveItem = async (itemId: string) => {
    try {
      await updateDoc(doc(db, 'items', itemId), { status: 'APPROVED' });
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, status: 'APPROVED' } : i))
      );
      showToast(`Item ${itemId} approved and published to public catalog.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `items/${itemId}`);
    }
  };

  // Admin: Reject Item
  const handleRejectItem = async (itemId: string) => {
    try {
      await updateDoc(doc(db, 'items', itemId), { status: 'REJECTED' });
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, status: 'REJECTED' } : i))
      );
      showToast(`Item ${itemId} was marked rejected.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `items/${itemId}`);
    }
  };

  // Admin: Resolve Item
  const handleResolveItem = async (itemId: string) => {
    try {
      await updateDoc(doc(db, 'items', itemId), { status: 'RESOLVED' });
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, status: 'RESOLVED' } : i))
      );
      showToast(`Item ${itemId} marked as resolved/reunited.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `items/${itemId}`);
    }
  };

  // Admin: Delete Item
  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, 'items', itemId));
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      showToast(`Item ${itemId} permanently deleted.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `items/${itemId}`);
    }
  };

  // Admin: Approve Claim (and update item to CLAIMED)
  const handleApproveClaim = async (claimId: string) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    try {
      await updateDoc(doc(db, 'item_claims', claimId), {
        status: 'APPROVED',
        admin_notes: `Ownership verified and approved by Proctor Hariom.`,
      });

      // Synchronize item status to CLAIMED
      await updateDoc(doc(db, 'items', claim.item_id), {
        status: 'CLAIMED',
      });

      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status: 'APPROVED',
                admin_notes: 'Ownership verified and approved by Proctor Hariom.',
              }
            : c
        )
      );

      setItems((prev) =>
        prev.map((i) =>
          i.id === claim.item_id ? { ...i, status: 'CLAIMED' } : i
        )
      );

      showToast(`Claim approved! Item marked as CLAIMED.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `item_claims/${claimId}`);
    }
  };

  // Admin: Reject Claim
  const handleRejectClaim = async (claimId: string) => {
    try {
      await updateDoc(doc(db, 'item_claims', claimId), {
        status: 'REJECTED',
        admin_notes: `Proof was insufficient. Rejected by Proctor.`,
      });
      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status: 'REJECTED',
                admin_notes: 'Proof was insufficient. Rejected by Proctor.',
              }
            : c
        )
      );
      showToast(`Claim ${claimId} rejected.`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `item_claims/${claimId}`);
    }
  };

  const handleStudentLoginSuccess = (student: Student) => {
    setCurrentUser({ type: 'student', student });
    setCurrentView('student-dashboard');
    showToast(`Welcome back, ${student.name}!`);
  };

  const handleAdminLoginSuccess = (admin: Admin) => {
    setCurrentUser({ type: 'admin', admin });
    setCurrentView('admin-dashboard');
    showToast(`Logged in as Chief Proctor ${admin.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
    showToast('Logged out successfully.');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Popup */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-5 border border-slate-700">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Global Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenReportModal={(type) => setReportModalState({ isOpen: true, type })}
        onLogout={handleLogout}
      />

      {/* Main Page View Router */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {currentView === 'home' && (
          <HeroSection
            lostItems={items.filter((i) => i.type === 'LOST')}
            foundItems={items.filter((i) => i.type === 'FOUND')}
            currentUser={currentUser}
            onOpenReportModal={(type) => setReportModalState({ isOpen: true, type })}
            onViewDetails={(item) => setSelectedDetailsItem(item)}
            onClaimItem={(item) => setSelectedClaimItem(item)}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'browse-lost' && (
          <BrowseItemsPage
            items={items}
            currentUser={currentUser}
            initialTypeFilter="LOST"
            onViewDetails={(item) => setSelectedDetailsItem(item)}
            onClaimItem={(item) => setSelectedClaimItem(item)}
            onOpenReportModal={(type) => setReportModalState({ isOpen: true, type })}
          />
        )}

        {currentView === 'browse-found' && (
          <BrowseItemsPage
            items={items}
            currentUser={currentUser}
            initialTypeFilter="FOUND"
            onViewDetails={(item) => setSelectedDetailsItem(item)}
            onClaimItem={(item) => setSelectedClaimItem(item)}
            onOpenReportModal={(type) => setReportModalState({ isOpen: true, type })}
          />
        )}

        {currentView === 'student-dashboard' && currentUser?.student && (
          <StudentDashboard
            student={currentUser.student}
            items={items}
            claims={claims}
            currentUser={currentUser}
            onOpenReportModal={(type) => setReportModalState({ isOpen: true, type })}
            onViewDetails={(item) => setSelectedDetailsItem(item)}
            onClaimItem={(item) => setSelectedClaimItem(item)}
          />
        )}

        {currentView === 'admin-dashboard' && currentUser?.admin && (
          <AdminDashboard
            admin={currentUser.admin}
            items={items}
            claims={claims}
            students={students}
            onApproveItem={handleApproveItem}
            onRejectItem={handleRejectItem}
            onResolveItem={handleResolveItem}
            onDeleteItem={handleDeleteItem}
            onApproveClaim={handleApproveClaim}
            onRejectClaim={handleRejectClaim}
          />
        )}

        {currentView === 'dbms-lab' && (
          <DbmsWorkbench
            items={items}
            claims={claims}
            students={students}
            admins={admins}
          />
        )}

        {currentView === 'docs' && <DocsView />}
      </main>

      {/* College Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <span className="font-extrabold text-white text-sm block">
              Lost &amp; Found Portal
            </span>
            <p className="text-slate-400 leading-relaxed">
              IIIT Bhopal Campus Security and Proctorial Board. Providing verified item matching and ownership claims for university students.
            </p>
          </div>

          <div>
            <span className="font-bold text-white uppercase tracking-wider block mb-2 text-[11px]">
              Campus Portals
            </span>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => setCurrentView('home')} className="hover:text-white">
                  Home Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsStudentLoginOpen(true)}
                  className="hover:text-white"
                >
                  Student Login (Arth / Shivam)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="hover:text-white"
                >
                  Admin Authority (Hariom)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white uppercase tracking-wider block mb-2 text-[11px]">
              DBMS Course Project
            </span>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => setCurrentView('dbms-lab')} className="hover:text-white">
                  SQL Query Runner (10 Queries)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('docs')} className="hover:text-white">
                  Academic Project Report (19 Sections)
                </button>
              </li>
              <li>
                <span className="text-slate-500 font-mono text-[10px]">
                  Engine: MySQL 8.0 + Firestore
                </span>
              </li>
            </ul>
          </div>

          <div>
            <span className="font-bold text-white uppercase tracking-wider block mb-2 text-[11px]">
              Campus Helpdesk
            </span>
            <p className="text-slate-400">
              Chief Proctor Office, Room 102<br />
              Admin Block, IIIT Bhopal<br />
              Email: <span className="font-mono text-indigo-300">hariom@iiitbhopal.ac.in</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[11px]">
          <span>&copy; 2026 Lost and Found DBMS Project. Indian Institute of Information Technology, Bhopal.</span>
          <span className="mt-2 sm:mt-0">Built with Python FastAPI, MySQL, Tailwind CSS &amp; Firebase</span>
        </div>
      </footer>

      {/* Global Modals */}
      <ReportModal
        isOpen={reportModalState.isOpen}
        type={reportModalState.type}
        currentUser={currentUser}
        onClose={() => setReportModalState({ isOpen: false, type: 'LOST' })}
        onSubmit={handleSubmitReport}
        onPromptLogin={() => {
          setReportModalState({ isOpen: false, type: 'LOST' });
          setIsStudentLoginOpen(true);
        }}
      />

      <ClaimModal
        isOpen={!!selectedClaimItem}
        item={selectedClaimItem}
        currentUser={currentUser}
        onClose={() => setSelectedClaimItem(null)}
        onSubmitClaim={handleSubmitClaim}
        onPromptLogin={() => {
          setSelectedClaimItem(null);
          setIsStudentLoginOpen(true);
        }}
      />

      <ItemDetailsModal
        item={selectedDetailsItem}
        currentUser={currentUser}
        onClose={() => setSelectedDetailsItem(null)}
        onClaim={(item) => setSelectedClaimItem(item)}
      />

      <StudentLoginModal
        isOpen={isStudentLoginOpen}
        onClose={() => setIsStudentLoginOpen(false)}
        onLoginSuccess={handleStudentLoginSuccess}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
