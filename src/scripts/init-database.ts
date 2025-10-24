/**
 * YESCA Team - Database Initialization Script
 * Run this once to set up initial Firestore collections
 * 
 * Usage: node --loader ts-node/esm src/scripts/init-database.ts
 * Or: tsx src/scripts/init-database.ts
 */

import { adminDb } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

async function initializeDatabase() {
  console.log('🚀 Starting YESCA Team database initialization...\n');

  try {
    // 1. Create settings/system document
    console.log('📝 Creating settings/system document...');
    await adminDb.collection('settings').doc('system').set({
      current_camp: 'YC26',
      registration_open: false,
      maintenance_mode: false,
      app_version: '1.0.0',
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });
    console.log('✅ System settings created\n');

    // 2. Create settings/counters document
    console.log('📝 Creating settings/counters document...');
    await adminDb.collection('settings').doc('counters').set({
      member_counter: 0,
      registration_counter_YC26: 0,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });
    console.log('✅ Counters initialized\n');

    // 3. Create YC26 camp document
    console.log('📝 Creating camps/YC26 document...');
    await adminDb.collection('camps').doc('YC26').set({
      camp_id: 'YC26',
      title: 'YESCA Youth Camp 2026',
      theme: 'Freedom – Truth and Freedom',
      verse: 'John 8:32',
      year: 2026,
      location: 'Andhra Pradesh',
      start_date: Timestamp.fromDate(new Date('2026-01-15')), // Update with actual dates
      end_date: Timestamp.fromDate(new Date('2026-01-18')),
      status: 'upcoming',
      color_theme: {
        primary: '#3B82F6', // Blue
        secondary: '#10B981', // Green
      },
      registration_fee: {
        normal: 500,
        child: 300,
        faith_box: 250,
      },
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });
    console.log('✅ YC26 camp created\n');

    console.log('🎉 Database initialization complete!\n');
    console.log('📊 Created collections:');
    console.log('   ✅ settings/system');
    console.log('   ✅ settings/counters');
    console.log('   ✅ camps/YC26\n');
    console.log('🔐 Next step: Create super admin user\n');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
