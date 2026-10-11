import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Student, Admin, LostFoundItem, ItemClaim } from './types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(p => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial test connection as mandated by skill guidelines
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

// Initial seed data: Admin -> Hariom; Students -> Arth, Shivam only!
export const INITIAL_STUDENTS: Student[] = [
  {
    student_id: 'STU-ARTH',
    name: 'Arth',
    email: 'arth@iiitbhopal.ac.in',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    roll_number: '2023CSE015',
    phone: '+91 9876543210',
    password: 'student123',
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    student_id: 'STU-SHIVAM',
    name: 'Shivam',
    email: 'shivam@iiitbhopal.ac.in',
    department: 'Information Technology',
    year: '2nd Year',
    roll_number: '2024IT042',
    phone: '+91 9812345678',
    password: 'student123',
    created_at: '2026-08-01T11:00:00Z',
  },
];

export const INITIAL_ADMINS: Admin[] = [
  {
    admin_id: 'ADM-HARIOM',
    name: 'Hariom',
    email: 'hariom@iiitbhopal.ac.in',
    role: 'Chief Proctor / Admin',
    password: 'admin123',
    created_at: '2026-07-15T09:00:00Z',
  },
];

export const INITIAL_ITEMS: LostFoundItem[] = [
  {
    id: 'ITEM-001',
    item_id: 'ITEM-001',
    title: 'Blue HP Laptop Charger (65W Type-C)',
    category: 'Electronics',
    description: 'Left on the second floor desk of the Central Library reading room next to Window 4.',
    type: 'LOST',
    status: 'APPROVED',
    location: 'Central Library - 2nd Floor',
    date_incident: '2026-10-08',
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
    student_id: 'STU-ARTH',
    student_name: 'Arth',
    student_email: 'arth@iiitbhopal.ac.in',
    created_at: '2026-10-08T14:30:00Z',
  },
  {
    id: 'ITEM-002',
    item_id: 'ITEM-002',
    title: 'College Student ID Card (Roll: 2024IT042)',
    category: 'ID Cards',
    description: 'Found near the Nescafe cafeteria counter during the 1:30 PM lunch break.',
    type: 'FOUND',
    status: 'APPROVED',
    location: 'Campus Cafeteria - Nescafe Counter',
    date_incident: '2026-10-09',
    image_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    student_id: 'STU-SHIVAM',
    student_name: 'Shivam',
    student_email: 'shivam@iiitbhopal.ac.in',
    created_at: '2026-10-09T13:45:00Z',
  },
  {
    id: 'ITEM-003',
    item_id: 'ITEM-003',
    title: 'Scientific Calculator Casio fx-991EX Classwiz',
    category: 'Electronics',
    description: 'Black casing with silver buttons, has a small white sticker on the back cover.',
    type: 'LOST',
    status: 'PENDING',
    location: 'Academic Block A - Room 204',
    date_incident: '2026-10-10',
    image_url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
    student_id: 'STU-SHIVAM',
    student_name: 'Shivam',
    student_email: 'shivam@iiitbhopal.ac.in',
    created_at: '2026-10-10T16:20:00Z',
  },
  {
    id: 'ITEM-004',
    item_id: 'ITEM-004',
    title: 'Milton Thermosteel Water Bottle (1L Silver)',
    category: 'Accessories',
    description: 'Silver stainless steel with slight dent at bottom rim, found near Badminton Court.',
    type: 'FOUND',
    status: 'APPROVED',
    location: 'Sports Complex - Badminton Court',
    date_incident: '2026-10-07',
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80',
    student_id: 'STU-ARTH',
    student_name: 'Arth',
    student_email: 'arth@iiitbhopal.ac.in',
    created_at: '2026-10-07T18:10:00Z',
  },
  {
    id: 'ITEM-005',
    item_id: 'ITEM-005',
    title: 'Fastrack Black Leather Wallet with Driving License',
    category: 'Accessories',
    description: 'Contains driving license, debit card and campus hostel room key 218.',
    type: 'LOST',
    status: 'CLAIMED',
    location: 'Football Ground Bleachers',
    date_incident: '2026-10-05',
    image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
    student_id: 'STU-ARTH',
    student_name: 'Arth',
    student_email: 'arth@iiitbhopal.ac.in',
    created_at: '2026-10-05T19:00:00Z',
  },
  {
    id: 'ITEM-006',
    item_id: 'ITEM-006',
    title: 'Database System Concepts Book (Korth 7th Ed)',
    category: 'Books',
    description: 'Found left on bench outside Computer Lab 3 after DBMS practical exam.',
    type: 'FOUND',
    status: 'APPROVED',
    location: 'Computer Science Department - Lab 3',
    date_incident: '2026-10-06',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    student_id: 'STU-SHIVAM',
    student_name: 'Shivam',
    student_email: 'shivam@iiitbhopal.ac.in',
    created_at: '2026-10-06T12:00:00Z',
  },
  {
    id: 'ITEM-007',
    item_id: 'ITEM-007',
    title: 'Noise ColorFit Pulse 2 Smartwatch (Teal Blue)',
    category: 'Electronics',
    description: 'Found on the washroom basin ledge in Admin Block Ground Floor.',
    type: 'FOUND',
    status: 'PENDING',
    location: 'Admin Block - Ground Floor',
    date_incident: '2026-10-11',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    student_id: 'STU-ARTH',
    student_name: 'Arth',
    student_email: 'arth@iiitbhopal.ac.in',
    created_at: '2026-10-11T08:15:00Z',
  },
  {
    id: 'ITEM-008',
    item_id: 'ITEM-008',
    title: 'Grey Skybags Campus Backpack with Notebooks',
    category: 'Bags',
    description: 'Lost after evening coding club workshop. Contains Data Structures notebook.',
    type: 'LOST',
    status: 'RESOLVED',
    location: 'Auditorium Seminar Hall 1',
    date_incident: '2026-10-04',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    student_id: 'STU-SHIVAM',
    student_name: 'Shivam',
    student_email: 'shivam@iiitbhopal.ac.in',
    created_at: '2026-10-04T20:00:00Z',
  },
];

export const INITIAL_CLAIMS: ItemClaim[] = [
  {
    id: 'CLM-001',
    claim_id: 'CLM-001',
    item_id: 'ITEM-002',
    item_title: 'College Student ID Card (Roll: 2024IT042)',
    student_id: 'STU-SHIVAM',
    student_name: 'Shivam',
    student_email: 'shivam@iiitbhopal.ac.in',
    reason_proof: 'This is my college ID card. I submitted it for safekeeping and verification with Proctor Hariom sir.',
    status: 'APPROVED',
    admin_notes: 'Verified with campus enrollment database.',
    created_at: '2026-10-09T15:00:00Z',
  },
  {
    id: 'CLM-002',
    claim_id: 'CLM-002',
    item_id: 'ITEM-004',
    item_title: 'Milton Thermosteel Water Bottle (1L Silver)',
    student_id: 'STU-SHIVAM',
    student_name: 'Shivam',
    student_email: 'shivam@iiitbhopal.ac.in',
    reason_proof: 'The bottle belongs to me; it has my initials "SK" engraved on the bottom lid and was lost after practice.',
    status: 'PENDING',
    created_at: '2026-10-08T09:30:00Z',
  },
];
