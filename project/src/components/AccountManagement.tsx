import { useState, useEffect } from 'react';
import { Wallet, AlertTriangle, Plus, X } from 'lucide-react';
import { Account, Customer } from '../types';
import { accountAPI, customerAPI } from '../services/api';

const LOW_BALANCE_THRESHOLD = 1000;

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    CustomerID: '',
    Type: '',
    Balance: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [accountsData, customersData] = await Promise.all([
        accountAPI.getAll(),
        customerAPI.getAll(),
      ]);
      setAccounts(accountsData);
      setCustomers(customersData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const accountData = {
        CustomerID: parseInt(formData.CustomerID),
        Type: formData.Type,
        Balance: parseFloat(formData.Balance),
      };

      await accountAPI.create(accountData);
      await loadData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  const resetForm = () => {
    setFormData({
      CustomerID: '',
      Type: '',
      Balance: '',
    });
    setIsFormOpen(false);
  };

  const getCustomerName = (customerId: number) => {
    return customers.find((c) => c.CustomerID === customerId)?.Name || 'Unknown';
  };

  const lowBalanceAccounts = accounts.filter((acc) => acc.Balance < LOW_BALANCE_THRESHOLD);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading accounts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Wallet className="w-7 h-7" />
          Account Management
        </h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Account
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {lowBalanceAccounts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Low Balance Alert</h3>
              <p className="text-sm text-yellow-700">
                {lowBalanceAccounts.length} account(s) have balance below ${LOW_BALANCE_THRESHOLD.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add New Account</h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                <select
                  required
                  value={formData.CustomerID}
                  onChange={(e) => setFormData({ ...formData, CustomerID: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.CustomerID} value={customer.CustomerID}>
                      {customer.Name} (ID: {customer.CustomerID})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <select
                  required
                  value={formData.Type}
                  onChange={(e) => setFormData({ ...formData, Type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                  <option value="Fixed Deposit">Fixed Deposit</option>
                  <option value="Recurring Deposit">Recurring Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Balance</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.Balance}
                  onChange={(e) => setFormData({ ...formData, Balance: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => {
          const isLowBalance = account.Balance < LOW_BALANCE_THRESHOLD;
          return (
            <div
              key={account.AccountID}
              className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border ${
                isLowBalance ? 'border-yellow-300 bg-yellow-50' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${isLowBalance ? 'bg-yellow-100' : 'bg-green-100'}`}>
                    <Wallet className={`w-6 h-6 ${isLowBalance ? 'text-yellow-600' : 'text-green-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{account.Type}</h3>
                    <p className="text-sm text-gray-500">ACC-{account.AccountID}</p>
                  </div>
                </div>
                {isLowBalance && (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Customer</p>
                  <p className="font-medium text-gray-800">{getCustomerName(account.CustomerID)}</p>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Balance</p>
                  <p className={`text-2xl font-bold ${isLowBalance ? 'text-yellow-700' : 'text-green-600'}`}>
                    ${account.Balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                {isLowBalance && (
                  <div className="bg-yellow-100 border border-yellow-200 rounded-lg px-3 py-2">
                    <p className="text-xs text-yellow-800 font-medium">Low Balance Alert</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {accounts.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No accounts found. Add your first account to get started.</p>
        </div>
      )}
    </div>
  );
}
