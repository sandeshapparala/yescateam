// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */

/**
 * Initialize Database API Route
 * Visit: http://localhost:3000/api/init-database
 * This will create initial Firestore collections
 */

import { adminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Starting database initialization...');

    // 1. Create settings/system document
    await adminDb.collection('settings').doc('system').set({
      current_camp: 'YC26',
      registration_open: false,
      maintenance_mode: false,
      app_version: '1.0.0',
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    // 2. Create settings/counters document
    await adminDb.collection('settings').doc('counters').set({
      memberCounter: 0,
      yc26RegistrationCounter: 0,
      yc26AttendedCounter: 0, // Increments when ID card is printed
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    // 3. Create YC26 camp document
    await adminDb.collection('camps').doc('YC26').set({
      camp_id: 'YC26',
      title: 'YESCA Youth Camp 2026',
      theme: 'Freedom – Truth and Freedom',
      verse: 'John 8:32',
      year: 2026,
      location: 'Andhra Pradesh',
      start_date: Timestamp.fromDate(new Date('2026-01-15')),
      end_date: Timestamp.fromDate(new Date('2026-01-18')),
      status: 'upcoming',
      color_theme: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
      registration_fee: {
        normal: 500,
        child: 300,
        faith_box: 250,
      },
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully!',
      collections_created: [
        'settings/system',
        'settings/counters',
        'camps/YC26',
      ],
    });

  } catch (error: any) {
    console.error('❌ Error initializing database:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
