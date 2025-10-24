// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */

// Print ID Card API Route
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const { registration_id, collected_faithbox } = await request.json();

    if (!registration_id) {
      return NextResponse.json(
        { error: 'Missing registration_id' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();

    // Get registration to check if already printed
    const regRef = adminDb
      .collection('camps')
      .doc('YC26')
      .collection('registrations')
      .doc(registration_id);

    const regDoc = await regRef.get();
    const regData = regDoc.data();

    if (!regData) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    const isReprint = regData.id_card_printed === true;
    let autoAssignedGroup = regData.group_name;
    let attendedNumber = regData.yc26_attended_number;

    // Only increment counter and assign group if printing for the FIRST time
    if (!isReprint) {
      // Get and increment yc26AttendedCounter
      const counterRef = adminDb.collection('settings').doc('counters');
      const counterDoc = await counterRef.get();
      const counters = counterDoc.data() || {};
      const currentAttendedCounter = counters.yc26AttendedCounter || 0;
      const newAttendedCounter = currentAttendedCounter + 1;

      // Auto-assign group based on last digit of attended counter (1-10 cycle)
      const lastDigit = newAttendedCounter % 10;
      const groupIndex = lastDigit === 0 ? 9 : lastDigit - 1; // 1->A, 2->B, ..., 10->J, 11->A
      const GROUPS = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H', 'Group I', 'Group J'];
      autoAssignedGroup = GROUPS[groupIndex];
      attendedNumber = newAttendedCounter;

      // Batch update: registration and counter
      const batch = adminDb.batch();
      
      const updateData: any = {
        group_name: autoAssignedGroup, // Auto-assigned based on attended counter
        yc26_attended_number: attendedNumber, // Attended sequence number
        id_card_printed: true,
        id_card_printed_at: timestamp,
        attendance_status: 'checked_in', // Mark as checked in when ID is printed
        updated_at: timestamp,
      };

      // Only update faithbox status if it's a faithbox registration
      if (collected_faithbox !== undefined) {
        updateData.collected_faithbox = collected_faithbox;
        updateData.faithbox_collected_at = collected_faithbox ? timestamp : null;
      }

      batch.update(regRef, updateData);
      batch.update(counterRef, {
        yc26AttendedCounter: newAttendedCounter,
        lastUpdated: timestamp,
      });

      await batch.commit();
    } else {
      // Re-print: Only update faithbox status and last printed time if needed
      const updateData: any = {
        id_card_printed_at: timestamp, // Update last print time
        updated_at: timestamp,
      };

      // Only update faithbox status if provided and it's a faithbox registration
      if (collected_faithbox !== undefined) {
        updateData.collected_faithbox = collected_faithbox;
        updateData.faithbox_collected_at = collected_faithbox ? timestamp : null;
      }

      await regRef.update(updateData);
    }

    // Create audit log
    await adminDb.collection('audit_logs').add({
      action: isReprint ? 'id_card_reprinted' : 'id_card_printed',
      resource_type: 'registration',
      resource_id: registration_id,
      actor_type: 'admin',
      actor_id: 'front_desk', // TODO: Get actual user ID from auth
      details: {
        group_name: autoAssignedGroup,
        attended_number: attendedNumber,
        collected_faithbox,
        is_reprint: isReprint,
      },
      timestamp,
    });

    return NextResponse.json({
      success: true,
      message: isReprint ? 'ID card re-printed successfully' : 'ID card printed successfully',
      group_name: autoAssignedGroup,
      attended_number: attendedNumber,
      is_reprint: isReprint,
    });
  } catch (error) {
    console.error('Print ID error:', error);
    return NextResponse.json(
      { error: 'Failed to update registration', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
