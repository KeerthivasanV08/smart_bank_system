import { Customer, Account, Transaction, Loan, DashboardStats } from '../types';
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const customerAPI = {
  getAll: async (): Promise<Customer[]> => {
    const response = await fetch(`${API_BASE_URL}/customers`);
    return handleResponse<Customer[]>(response);
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`);
    return handleResponse<Customer>(response);
  },

  create: async (customer: Omit<Customer, 'CustomerID'>): Promise<Customer> => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    return handleResponse<Customer>(response);
  },

  update: async (id: number, customer: Partial<Customer>): Promise<Customer> => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    return handleResponse<Customer>(response);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

export const accountAPI = {
  getAll: async (): Promise<Account[]> => {
    const response = await fetch(`${API_BASE_URL}/accounts`);
    return handleResponse<Account[]>(response);
  },

  getByCustomerId: async (customerId: number): Promise<Account[]> => {
    const response = await fetch(`${API_BASE_URL}/accounts/customer/${customerId}`);
    return handleResponse<Account[]>(response);
  },

  create: async (account: Omit<Account, 'AccountID'>): Promise<Account> => {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account),
    });
    return handleResponse<Account>(response);
  },

  update: async (id: number, account: Partial<Account>): Promise<Account> => {
    const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account),
    });
    return handleResponse<Account>(response);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

export const transactionAPI = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    return handleResponse<Transaction[]>(response);
  },

  getByAccountId: async (accountId: number): Promise<Transaction[]> => {
    const response = await fetch(`${API_BASE_URL}/transactions/account/${accountId}`);
    return handleResponse<Transaction[]>(response);
  },

  deposit: async (accountId: number, amount: number): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/transactions/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, amount }),
    });
    return handleResponse<Transaction>(response);
  },

  withdraw: async (accountId: number, amount: number): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/transactions/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, amount }),
    });
    return handleResponse<Transaction>(response);
  },

  transfer: async (fromAccountId: number, toAccountId: number, amount: number): Promise<{ from: Transaction; to: Transaction }> => {
    const response = await fetch(`${API_BASE_URL}/transactions/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromAccountId, toAccountId, amount }),
    });
    return handleResponse<{ from: Transaction; to: Transaction }>(response);
  },
};

export const loanAPI = {
  getAll: async (): Promise<Loan[]> => {
    const response = await fetch(`${API_BASE_URL}/loans`);
    return handleResponse<Loan[]>(response);
  },

  getByCustomerId: async (customerId: number): Promise<Loan[]> => {
    const response = await fetch(`${API_BASE_URL}/loans/customer/${customerId}`);
    return handleResponse<Loan[]>(response);
  },

  apply: async (loan: Omit<Loan, 'LoanID'>): Promise<Loan> => {
    const response = await fetch(`${API_BASE_URL}/loans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loan),
    });
    return handleResponse<Loan>(response);
  },

  approve: async (id: number): Promise<Loan> => {
    const response = await fetch(`${API_BASE_URL}/loans/${id}/approve`, {
      method: 'PUT',
    });
    return handleResponse<Loan>(response);
  },

  close: async (id: number): Promise<Loan> => {
    const response = await fetch(`${API_BASE_URL}/loans/${id}/close`, {
      method: 'PUT',
    });
    return handleResponse<Loan>(response);
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/loans/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
    return handleResponse<DashboardStats>(response);
  },
};
export const api = axios.create({
  baseURL: API_URL,
});
