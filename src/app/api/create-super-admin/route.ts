/**
 * Create Super Admin API Route
 * Visit: http://localhost:3000/api/create-super-admin
 * This will create the first super admin user
 */

import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

// 🔐 Configure your super admin details
const SUPER_ADMIN_CONFIG = {
  email: 'Sandeshapparala@gmail.com',
  password: 'YescaAdmin@2026', // ⚠️ Change this!
  displayName: 'Super Admin',
  name: 'YESCA Super Admin',
};

export async function GET(request: NextRequest) {
  try {
    console.log('🔐 Creating Super Admin user...');

    // 1. Create user in Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email: SUPER_ADMIN_CONFIG.email,
      password: SUPER_ADMIN_CONFIG.password,
      displayName: SUPER_ADMIN_CONFIG.displayName,
      emailVerified: true,
    });

    // 2. Create role document in Firestore
    await adminDb.collection('roles').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name: SUPER_ADMIN_CONFIG.name,
      email: SUPER_ADMIN_CONFIG.email,
      role: 'super_admin',
      permissions: ['*'],
      assigned_by: 'system',
      assigned_on: Timestamp.now(),
      active: true,
      created_at: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      message: 'Super Admin created successfully!',
      user: {
        uid: userRecord.uid,
        email: SUPER_ADMIN_CONFIG.email,
        password: SUPER_ADMIN_CONFIG.password,
      },
      warning: '⚠️ Change the password after first login!',
    });

  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      const existingUser = await adminAuth.getUserByEmail(SUPER_ADMIN_CONFIG.email);
      return NextResponse.json({
        success: false,
        message: 'User already exists',
        user: {
          uid: existingUser.uid,
          email: existingUser.email,
        },
      }, { status: 409 });
    }

    console.error('❌ Error creating super admin:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
