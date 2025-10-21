import { useState } from "react";
import { Customers } from "./pages/Customers";
import { SummaryCards } from "./components/SummaryCards";

function App() {
  const [activePage, setActivePage] = useState("customers");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Smart Bank Dashboard</h1>

      <SummaryCards />

      <nav className="flex justify-center gap-4 mb-6">
        <button onClick={() => setActivePage("customers")} className="btn">Customers</button>
        <button onClick={() => setActivePage("accounts")} className="btn">Accounts</button>
        <button onClick={() => setActivePage("transactions")} className="btn">Transactions</button>
        <button onClick={() => setActivePage("loans")} className="btn">Loans</button>
      </nav>

      {activePage === "customers" && <Customers />}
      {/* Later you’ll add Accounts, Transactions, Loans pages */}
    </div>
  );
}

export default App;
