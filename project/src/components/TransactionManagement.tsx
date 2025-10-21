import { useState, useEffect } from 'react';
import { ArrowUpDown, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Transaction, Account } from '../types';
import { transactionAPI, accountAPI } from '../services/api';

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [formData, setFormData] = useState({
    accountId: '',
    fromAccountId: '',
    toAccountId: '',
    amount: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, accountsData] = await Promise.all([
        transactionAPI.getAll(),
        accountAPI.getAll(),
      ]);
      setTransactions(transactionsData.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime()));
      setAccounts(accountsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transactionAPI.deposit(parseInt(formData.accountId), parseFloat(formData.amount));
      await loadData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process deposit');
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transactionAPI.withdraw(parseInt(formData.accountId), parseFloat(formData.amount));
      await loadData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process withdrawal');
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transactionAPI.transfer(
        parseInt(formData.fromAccountId),
        parseInt(formData.toAccountId),
        parseFloat(formData.amount)
      );
      await loadData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process transfer');
    }
  };

  const resetForm = () => {
    setFormData({
      accountId: '',
      fromAccountId: '',
      toAccountId: '',
      amount: '',
    });
  };

  const getAccountInfo = (accountId: number) => {
    const account = accounts.find((a) => a.AccountID === accountId);
    return account ? `ACC-${account.AccountID} (${account.Type})` : 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <ArrowUpDown className="w-7 h-7" />
        Transaction Management
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'deposit'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Deposit
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'withdraw'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <TrendingDown className="w-4 h-4 inline mr-2" />
            Withdraw
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'transfer'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Transfer
          </button>
        </div>

        {activeTab === 'deposit' && (
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
              <select
                required
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option key={account.AccountID} value={account.AccountID}>
                    {getAccountInfo(account.AccountID)} - Balance: ${account.Balance.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
            >
              Deposit Money
            </button>
          </form>
        )}

        {activeTab === 'withdraw' && (
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
              <select
                required
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option key={account.AccountID} value={account.AccountID}>
                    {getAccountInfo(account.AccountID)} - Balance: ${account.Balance.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors"
            >
              Withdraw Money
            </button>
          </form>
        )}

        {activeTab === 'transfer' && (
          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Account</label>
              <select
                required
                value={formData.fromAccountId}
                onChange={(e) => setFormData({ ...formData, fromAccountId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option key={account.AccountID} value={account.AccountID}>
                    {getAccountInfo(account.AccountID)} - Balance: ${account.Balance.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Account</label>
              <select
                required
                value={formData.toAccountId}
                onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Account</option>
                {accounts
                  .filter((account) => account.AccountID.toString() !== formData.fromAccountId)
                  .map((account) => (
                    <option key={account.AccountID} value={account.AccountID}>
                      {getAccountInfo(account.AccountID)} - Balance: ${account.Balance.toLocaleString()}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
            >
              Transfer Money
            </button>
          </form>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction.TransID}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    transaction.Type === 'Deposit' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {transaction.Type === 'Deposit' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{transaction.Type}</p>
                  <p className="text-sm text-gray-500">{getAccountInfo(transaction.AccountID)}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    transaction.Type === 'Deposit' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.Type === 'Deposit' ? '+' : '-'}$
                  {transaction.Amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500">{new Date(transaction.Date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ArrowUpDown className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
