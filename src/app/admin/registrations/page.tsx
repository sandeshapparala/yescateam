// Admin Registrations Page - View and Manage Camp Registrations
'use client';

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Search, Printer, Eye, Filter } from 'lucide-react';
import { PrintIdModal } from '@/components/admin/modals/PrintIdModal';

interface Registration {
  registration_id: string;
  member_id: string;
  full_name: string;
  phone_number: string;
  registration_type: string;
  registration_date: string;
  payment_status: string;
  group_name: string | null;
  yc26_registration_number?: number;
  yc26_attended_number?: number;
  collected_faithbox: boolean | null;
  registered_by: string;
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    const registrationsRef = collection(db, 'camps', 'YC26', 'registrations');
    const q = query(registrationsRef, orderBy('registration_date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const regs: Registration[] = [];
      snapshot.forEach((doc) => {
        regs.push({ ...doc.data(), registration_id: doc.id } as Registration);
      });
      setRegistrations(regs);
      setFilteredRegistrations(regs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = registrations;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (reg) =>
          reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg.member_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg.registration_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg.phone_number.includes(searchQuery)
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((reg) => reg.registration_type === filterType);
    }

    // Payment filter
    if (filterPayment !== 'all') {
      filtered = filtered.filter((reg) => reg.payment_status === filterPayment);
    }

    setFilteredRegistrations(filtered);
  }, [searchQuery, filterType, filterPayment, registrations]);

  const handlePrint = async (registration: Registration) => {
    setSelectedRegistration(registration);
    setShowPrintModal(true);
  };

  const handlePrintConfirm = async (faithboxCollected?: boolean) => {
    if (!selectedRegistration) return;

    try {
      const response = await fetch('/api/admin/print-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_id: selectedRegistration.registration_id,
          collected_faithbox: faithboxCollected,
        }),
      });

      if (!response.ok) throw new Error('Failed to update registration');

      const result = await response.json();
      
      // Show success message with assigned group
      alert(`ID Card Printed!\nGroup Assigned: ${result.group_name}\nAttended #${result.attended_number}`);

      // Trigger actual print
      window.print();
    } catch (error) {
      console.error('Print error:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Camp Registrations</h1>
          <p className="text-muted-foreground mt-1">
            Manage YC26 camp registrations and print ID cards
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, ID, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Types</option>
              <option value="normal">Normal</option>
              <option value="faithbox">Faithbox</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-background rounded-md focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Registrations</div>
          <div className="text-2xl font-bold text-foreground mt-1">{registrations.length}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Normal</div>
          <div className="text-2xl font-bold text-foreground mt-1">
            {registrations.filter((r) => r.registration_type === 'normal').length}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Faithbox</div>
          <div className="text-2xl font-bold text-foreground mt-1">
            {registrations.filter((r) => r.registration_type === 'faithbox').length}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Pending Payment</div>
          <div className="text-2xl font-bold text-foreground mt-1">
            {registrations.filter((r) => r.payment_status === 'pending').length}
          </div>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Reg#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Attended#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Member ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Group</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Payment</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Faithbox</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-muted-foreground">
                    No registrations found
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.registration_id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-semibold text-muted-foreground">
                      {reg.yc26_registration_number ? `#${reg.yc26_registration_number}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-primary">
                      {reg.yc26_attended_number ? `#${reg.yc26_attended_number}` : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-foreground">
                      {reg.member_id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {reg.full_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{reg.phone_number}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          reg.registration_type === 'faithbox'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {reg.registration_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-foreground">
                      {reg.group_name || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          reg.payment_status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : reg.payment_status === 'partial'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {reg.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {reg.registration_type === 'faithbox' ? (
                        reg.collected_faithbox ? (
                          <span className="text-green-600 dark:text-green-400">✓</span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400">✗</span>
                        )
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePrint(reg)}
                          size="sm"
                          variant={reg.group_name ? "outline" : "default"}
                          className="h-8"
                        >
                          <Printer className="h-3 w-3 mr-1" />
                          {reg.group_name ? 'Re-Print' : 'Print ID'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print ID Modal */}
      {selectedRegistration && (
        <PrintIdModal
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
          registration={selectedRegistration}
          onPrint={handlePrintConfirm}
        />
      )}
    </div>
  );
}
