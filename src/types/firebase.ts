// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */

import { Timestamp } from 'firebase/firestore';

// ===== MEMBER TYPES =====
export interface Member {
  id: string; // e.g., "YESCA0001"
  full_name: string;
  dob: Timestamp | Date;
  phone_number: string;
  gender: 'M' | 'F';
  church_name: string;
  address: string;
  believer: boolean;
  fathername: string;
  marriage_status: 'single' | 'married' | 'divorced' | 'widowed';
  baptism_date?: Timestamp | Date;
  faith_box_supporter: boolean;
  registered_camps: string[]; // e.g., ["YC25", "YC26"]
  education?: string;
  occupation?: string;
  future_goals?: string;
  current_skills?: string;
  desired_skills?: string;
  last_registered_camp?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// ===== CAMP TYPES =====
export interface Camp {
  camp_id: string; // e.g., "YC26"
  title: string; // e.g., "YESCA Youth Camp 2026"
  theme: string;
  verse: string;
  year: number;
  location: string;
  start_date: Timestamp | Date;
  end_date: Timestamp | Date;
  status: 'upcoming' | 'ongoing' | 'completed';
  color_theme: {
    primary: string; // hex color
    secondary: string; // hex color
  };
  registration_fee?: {
    normal: number;
    child: number;
    faith_box: number;
  };
}

// ===== REGISTRATION TYPES =====
export type RegistrationType = 'normal' | 'faithbox' | 'kids';
export type PaymentStatus = 'paid' | 'pending' | 'partial' | 'completed' | 'failed';

export interface Registration {
  registration_id: string;
  member_id: string;
  camp_id: string;
  full_name: string;
  phone_number: string;
  registration_type: 'normal' | 'faithbox' | 'kids';
  registration_date: string;
  payment_status: 'pending' | 'partial' | 'completed';
  payment_amount?: number;
  attendance_status: 'registered' | 'checked_in' | 'checked_out' | 'absent';
  group_name: string | null;
  collected_faithbox: boolean | null;
  faithbox_collected_at: string | null;
  id_card_printed: boolean;
  id_card_printed_at: string | null;
  registered_by: 'online' | 'front_desk';
  created_at: string;
  updated_at: string;
}

// ===== PAYMENT TYPES =====
export type PaymentMethod = 'phonepe' | 'cash' | 'upi' | 'card' | 'bank_transfer';

export interface Payment {
  payment_id: string;
  registration_id: string;
  amount: number;
  payment_method: PaymentMethod;
  transaction_id?: string; // PhonePe transaction ID
  payment_status: PaymentStatus;
  paid_at?: Timestamp;
  created_at: Timestamp;
  verified_by?: string;
}

// ===== ANNOUNCEMENT TYPES =====
export interface Announcement {
  announcement_id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_by: string; // Admin name
  created_at: Timestamp;
  published: boolean;
  target_audience?: 'all' | 'attendees' | 'staff';
}

// ===== DEVOTIONAL TYPES =====
export interface Devotional {
  devotional_id: string;
  title: string;
  content: string; // Markdown or HTML
  verse: string;
  author: string;
  date: Timestamp | Date;
  camp_day?: number; // e.g., Day 1, Day 2
  published: boolean;
  created_at: Timestamp;
}

// ===== GAME TYPES =====
export interface Game {
  game_id: string;
  title: string;
  description: string;
  game_type: 'team' | 'individual';
  teams?: string[]; // team names
  leaderboard?: GameScore[];
  status: 'upcoming' | 'ongoing' | 'completed';
  scheduled_at?: Timestamp;
  created_at: Timestamp;
}

export interface GameScore {
  team_name?: string;
  participant_name?: string;
  score: number;
  rank?: number;
}

// ===== ROLE TYPES =====
export type RoleType = 'super_admin' | 'admin' | 'front_desk' | 'user';

export interface Role {
  uid: string; // Firebase Auth UID
  name: string;
  email: string;
  role: RoleType;
  permissions: string[]; // e.g., ['manage_registrations', 'verify_members', 'manage_payments']
  assigned_by: string;
  assigned_on: Timestamp;
  active: boolean;
}

// ===== SETTINGS TYPES =====
export interface SystemSettings {
  current_camp: string; // e.g., "YC26"
  registration_open: boolean;
  maintenance_mode: boolean;
  app_version: string;
}

export interface Counters {
  member_counter: number; // Current member ID counter
  [key: `registration_counter_${string}`]: number; // e.g., registration_counter_YC26
}

// ===== AUDIT LOG TYPES =====
export interface AuditLog {
  log_id: string;
  action: string; // e.g., "link_member", "create_registration", "update_payment"
  admin: string; // Admin name or email
  target_collection: string;
  target_id: string;
  old_value?: any;
  new_value?: any;
  timestamp: Timestamp;
  ip_address?: string;
}

// ===== API RESPONSE TYPES =====
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
