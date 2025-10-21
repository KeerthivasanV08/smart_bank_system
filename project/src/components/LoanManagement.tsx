import { useState, useEffect } from 'react';
import { CircleDollarSign, Check, X as XIcon, Plus, Calculator } from 'lucide-react';
import { Loan, Customer } from '../types';
import { loanAPI, customerAPI } from '../services/api';

export default function LoanManagement() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    CustomerID: '',
    Amount: '',
    InterestRate: '',
    EMI: '',
    Status: 'Pending',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [loansData, customersData] = await Promise.all([
        loanAPI.getAll(),
        customerAPI.getAll(),
      ]);
      setLoans(loansData);
      setCustomers(customersData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load loans');
    } finally {
      setLoading(false);
    }
  };

  const calculateEMI = () => {
    const amount = parseFloat(formData.Amount);
    const rate = parseFloat(formData.InterestRate);

    if (!amount || !rate) return;

    const monthlyRate = rate / 12 / 100;
    const tenure = 12;
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);

    setFormData({ ...formData, EMI: emi.toFixed(2) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loanData = {
        CustomerID: parseInt(formData.CustomerID),
        Amount: parseFloat(formData.Amount),
        InterestRate: parseFloat(formData.InterestRate),
        EMI: parseFloat(formData.EMI),
        Status: formData.Status,
      };

      await loanAPI.apply(loanData);
      await loadData();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply for loan');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await loanAPI.approve(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve loan');
    }
  };

  const handleClose = async (id: number) => {
    if (!confirm('Are you sure you want to close this loan?')) return;

    try {
      await loanAPI.close(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close loan');
    }
  };

  const resetForm = () => {
    setFormData({
      CustomerID: '',
      Amount: '',
      InterestRate: '',
      EMI: '',
      Status: 'Pending',
    });
    setIsFormOpen(false);
  };

  const getCustomerName = (customerId: number) => {
    return customers.find((c) => c.CustomerID === customerId)?.Name || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTotalInterest = (amount: number, rate: number) => {
    return (amount * rate * 1) / 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading loans...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CircleDollarSign className="w-7 h-7" />
          Loan Management
        </h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Apply for Loan
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Apply for New Loan</h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <XIcon className="w-6 h-6" />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.Amount}
                  onChange={(e) => setFormData({ ...formData, Amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.InterestRate}
                  onChange={(e) => setFormData({ ...formData, InterestRate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EMI (Monthly)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.EMI}
                    onChange={(e) => setFormData({ ...formData, EMI: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={calculateEMI}
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg transition-colors"
                    title="Auto-calculate EMI"
                  >
                    <Calculator className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  required
                  value={formData.Status}
                  onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  Apply
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
        {loans.map((loan) => {
          const totalInterest = getTotalInterest(loan.Amount, loan.InterestRate);
          const totalRepayment = loan.Amount + totalInterest;

          return (
            <div
              key={loan.LoanID}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <CircleDollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Loan #{loan.LoanID}</h3>
                    <p className="text-sm text-gray-500">{getCustomerName(loan.CustomerID)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.Status)}`}>
                  {loan.Status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Principal Amount:</span>
                  <span className="font-semibold text-gray-800">
                    ${loan.Amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interest Rate:</span>
                  <span className="font-semibold text-gray-800">{loan.InterestRate}%</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly EMI:</span>
                  <span className="font-semibold text-gray-800">
                    ${loan.EMI.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Total Interest:</span>
                    <span className="font-semibold text-orange-600">
                      ${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Repayment:</span>
                    <span className="font-bold text-blue-600">
                      ${totalRepayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {loan.Status === 'Pending' && (
                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => handleApprove(loan.LoanID)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                  </div>
                )}

                {loan.Status === 'Approved' && (
                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => handleClose(loan.LoanID)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <XIcon className="w-4 h-4" />
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {loans.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <CircleDollarSign className="w-16 h-16 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No loans found. Apply for your first loan to get started.</p>
        </div>
      )}
    </div>
  );
}
