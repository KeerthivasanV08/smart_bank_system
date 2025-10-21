import { useState, useEffect } from 'react';
import { Users, Wallet, ArrowUpDown, CircleDollarSign } from 'lucide-react';
import { DashboardStats } from '../types';
import { dashboardAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalAccounts: 0,
    totalLoans: 0,
    totalTransactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Accounts',
      value: stats.totalAccounts,
      icon: Wallet,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Loans',
      value: stats.totalLoans,
      icon: CircleDollarSign,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions,
      icon: ArrowUpDown,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to Smart Bank Management System</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-8 h-8 ${card.textColor}`} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className={`text-3xl font-bold ${card.textColor}`}>
                {card.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
        <h3 className="text-2xl font-bold mb-2">Smart Bank Management System</h3>
        <p className="text-blue-100 mb-4">
          Efficiently manage your customers, accounts, transactions, and loans all in one place.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-semibold mb-2">Customer Management</h4>
            <p className="text-sm text-blue-100">Add, view, edit, and manage customer information</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-semibold mb-2">Account Management</h4>
            <p className="text-sm text-blue-100">Monitor account balances with low balance alerts</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-semibold mb-2">Transaction Management</h4>
            <p className="text-sm text-blue-100">Deposit, withdraw, and transfer funds seamlessly</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <h4 className="font-semibold mb-2">Loan Management</h4>
            <p className="text-sm text-blue-100">Apply, approve, and manage loans with auto interest calculation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
