export interface Customer {
  CustomerID: number;
  Name: string;
  age: number;
  gender: string;
  Phone: string;
  Address: string;
}

export interface Account {
  AccountID: number;
  CustomerID: number;
  Type: string;
  Balance: number;
}

export interface Transaction {
  TransID: number;
  AccountID: number;
  Amount: number;
  Type: string;
  Date: string;
}

export interface Loan {
  LoanID: number;
  CustomerID: number;
  Amount: number;
  InterestRate: number;
  EMI: number;
  Status: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalAccounts: number;
  totalLoans: number;
  totalTransactions: number;
}
