// Admin Dashboard Page
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Users, ClipboardList, CreditCard, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, role } = useAuth();

  const stats = [
    {
      name: 'Total Members',
      value: '0',
      icon: Users,
      color: 'bg-blue-500',
      change: '+0%',
    },
    {
      name: 'Registrations',
      value: '0',
      icon: ClipboardList,
      color: 'bg-green-500',
      change: '+0%',
    },
    {
      name: 'Payments',
      value: '₹0',
      icon: CreditCard,
      color: 'bg-yellow-500',
      change: '+0%',
    },
    {
      name: 'Attendance',
      value: '0%',
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '0%',
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back, {role?.name || user?.email}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stat.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
            <Users className="mx-auto mb-2 text-blue-600" size={32} />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add Member
            </p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 transition-colors">
            <ClipboardList className="mx-auto mb-2 text-green-600" size={32} />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              New Registration
            </p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-yellow-500 dark:hover:border-yellow-400 transition-colors">
            <CreditCard className="mx-auto mb-2 text-yellow-600" size={32} />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Record Payment
            </p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No recent activity to display</p>
          <p className="text-sm mt-2">Activity will appear here as you use the system</p>
        </div>
      </div>
    </div>
  );
}
