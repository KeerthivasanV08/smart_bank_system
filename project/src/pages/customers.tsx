import { useEffect, useState } from "react";
import { api } from "../services/api";

export const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get("/customers")
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-3">Customer Management</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c: any) => (
            <tr key={c.CustomerID}>
              <td>{c.CustomerID}</td>
              <td>{c.Name}</td>
              <td>{c.age}</td>
              <td>{c.gender}</td>
              <td>{c.Phone}</td>
              <td>{c.Address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
