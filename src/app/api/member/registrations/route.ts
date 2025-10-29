// Get Member Registrations by Member ID
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const memberId = searchParams.get('member_id');

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Get all camps
    const campsRef = adminDb.collection('camps');
    const campsSnapshot = await campsRef.get();

    interface RegistrationData {
      registration_id: string;
      member_id: string;
      camp_id: string;
      registration_date?: string;
      created_at?: string;
      payment_status?: string;
      registration_type?: string;
      payment_amount?: number;
      attendance_status?: string;
      group_name?: string | null;
      full_name?: string;
      phone_number?: string;
      yc26_registration_number?: number;
      yc26_attended_number?: number | null;
      collected_faithbox?: boolean | null;
    }

    const registrations: RegistrationData[] = [];

    // For each camp, check if member has registration
    for (const campDoc of campsSnapshot.docs) {
      const registrationsRef = campDoc.ref.collection('registrations');
      const memberRegsQuery = registrationsRef.where('member_id', '==', memberId);
      const memberRegsSnapshot = await memberRegsQuery.get();

      memberRegsSnapshot.forEach((regDoc) => {
        registrations.push({
          registration_id: regDoc.id,
          ...regDoc.data(),
        } as RegistrationData);
      });
    }

    // Sort by registration date (newest first)
    registrations.sort((a, b) => {
      const dateA = new Date(a.registration_date || a.created_at || 0).getTime();
      const dateB = new Date(b.registration_date || b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({
      success: true,
      registrations,
      count: registrations.length,
    });
  } catch (error) {
    console.error('Get member registrations error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch registrations',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
