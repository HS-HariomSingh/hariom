export type ItemType = 'LOST' | 'FOUND';
export type ItemStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLAIMED' | 'RESOLVED';
export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ItemCategory =
  | 'Electronics'
  | 'Documents'
  | 'Books'
  | 'Accessories'
  | 'ID Cards'
  | 'Bags'
  | 'Clothing'
  | 'Other';

export interface Student {
  student_id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  roll_number: string;
  phone?: string;
  password?: string;
  created_at?: string;
}

export interface Admin {
  admin_id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  created_at?: string;
}

export interface LostFoundItem {
  id: string;
  item_id?: string;
  title: string;
  category: ItemCategory;
  description: string;
  type: ItemType;
  status: ItemStatus;
  location: string;
  date_incident: string;
  image_url?: string;
  student_id: string;
  student_name?: string;
  student_email?: string;
  created_at: string;
  updated_at?: string;
}

export interface ItemClaim {
  id: string;
  claim_id?: string;
  item_id: string;
  item_title?: string;
  student_id: string;
  student_name?: string;
  student_email?: string;
  reason_proof: string;
  status: ClaimStatus;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface CurrentUser {
  type: 'student' | 'admin';
  student?: Student;
  admin?: Admin;
}
