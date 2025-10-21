export const SummaryCards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-500 text-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold">Total Customers</h3>
        <p className="text-2xl font-bold">120</p>
      </div>
      <div className="bg-green-500 text-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold">Total Accounts</h3>
        <p className="text-2xl font-bold">85</p>
      </div>
      <div className="bg-yellow-500 text-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold">Loans</h3>
        <p className="text-2xl font-bold">40</p>
      </div>
      <div className="bg-purple-500 text-white p-4 rounded-2xl shadow">
        <h3 className="text-lg font-semibold">Transactions</h3>
        <p className="text-2xl font-bold">235</p>
      </div>
    </div>
  );
};
