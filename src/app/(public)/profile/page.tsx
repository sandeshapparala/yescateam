'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Phone, Church, Calendar, MapPin, FileText, ChevronRight, LogOut } from 'lucide-react';

interface MemberData {
  member_id: string;
  full_name: string;
  phone_number: string;
  gender: 'M' | 'F';
  age?: number;
  dob?: string;
  believer: boolean;
  church_name: string;
  address: string;
  fathername?: string;
  marriage_status?: string;
  baptism_date?: string;
  education?: string;
  occupation?: string;
  registered_camps?: string[];
}

interface RegistrationData {
  registration_id: string;
  member_id: string;
  camp_id: string;
  full_name: string;
  registration_type: string;
  registration_date: string;
  payment_status: string;
  payment_amount?: number;
  attendance_status: string;
  group_name?: string | null;
  yc26_registration_number?: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [showRegistrations, setShowRegistrations] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/register');
        return;
      }

      // User is authenticated, fetch their profile
      await fetchMemberData(user.uid);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchMemberData = async (uid: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/member/profile?uid=${uid}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      setMemberData(data.member);
    } catch (err) {
      console.error('Error fetching member data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    if (!memberData?.member_id) return;

    try {
      setLoadingRegistrations(true);
      const response = await fetch(`/api/member/registrations?member_id=${memberData.member_id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch registrations');
      }

      setRegistrations(data.registrations);
      setShowRegistrations(true);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load registrations');
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/register');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && !memberData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push('/register')} className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <Button variant="outline" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Member Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">{memberData?.full_name}</CardTitle>
                <CardDescription className="text-lg">{memberData?.member_id}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="font-medium">{memberData?.phone_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                  <p className="font-medium">{memberData?.gender === 'M' ? 'Male' : 'Female'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Age</p>
                  <p className="font-medium">{memberData?.age || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Church className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Church</p>
                  <p className="font-medium">{memberData?.church_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 md:col-span-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="font-medium">{memberData?.address}</p>
                </div>
              </div>

              {memberData?.occupation && (
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Occupation</p>
                    <p className="font-medium">{memberData.occupation}</p>
                  </div>
                </div>
              )}

              {memberData?.education && (
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Education</p>
                    <p className="font-medium">{memberData.education}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registrations Card */}
        <Card>
          <CardHeader>
            <CardTitle>Camp Registrations</CardTitle>
            <CardDescription>
              View your camp registration history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showRegistrations ? (
              <Button
                onClick={fetchRegistrations}
                disabled={loadingRegistrations}
                className="w-full gap-2"
              >
                {loadingRegistrations ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    View My Registrations
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            ) : registrations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No registrations found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg) => (
                  <Card key={reg.registration_id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{reg.camp_id}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {reg.registration_id}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              reg.payment_status === 'completed'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                            }`}
                          >
                            {reg.payment_status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Registration Type</p>
                          <p className="font-medium capitalize">{reg.registration_type}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Amount</p>
                          <p className="font-medium">
                            {reg.payment_amount ? `₹${reg.payment_amount}` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Attendance</p>
                          <p className="font-medium capitalize">{reg.attendance_status}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Registration Date</p>
                          <p className="font-medium">
                            {new Date(reg.registration_date).toLocaleDateString()}
                          </p>
                        </div>
                        {reg.group_name && (
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Group</p>
                            <p className="font-medium">{reg.group_name}</p>
                          </div>
                        )}
                        {reg.yc26_registration_number && (
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Registration #</p>
                            <p className="font-medium">{reg.yc26_registration_number}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
