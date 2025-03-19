import React, { useEffect, useState } from "react";
import {
  Package,
  Boxes,
  ClipboardList,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card } from "./Card";
import { showToast } from "../utils/showToast";
import axiosInstance from "../api/api";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/inventory-logs");
        setLogs(response.data.data.logs);
      } catch (error) {
        showToast(
          "error",
          error.response.data.message || error.response.data.error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          title="Total Products"
          value="124"
          icon={<Package className="w-6 h-6 text-blue-500" />}
        />
        <Card
          title="Low Stock Items"
          value="9"
          icon={<TrendingDown className="w-6 h-6 text-red-500" />}
        />
        <Card
          title="Categories"
          value="12"
          icon={<Boxes className="w-6 h-6 text-green-500" />}
        />
        <Card
          title="Users"
          value="6"
          icon={<Users className="w-6 h-6 text-purple-500" />}
        />
        <Card
          title="Inventory Logs Today"
          value="35"
          icon={<ClipboardList className="w-6 h-6 text-yellow-500" />}
        />
        <Card
          title="Recent Stock Updates"
          value="18"
          icon={<TrendingUp className="w-6 h-6 text-indigo-500" />}
        />
      </div>

      <section className="mt-10">
        <h3 className="text-lg font-medium mb-4">Recent Inventory Logs</h3>
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200 text-gray-600 text-left">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Price</th>
                <th className="p-3">Quantity Chnaged</th>
                <th className="p-3">Action</th>
                <th className="p-3">Performed By</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="p-3">{log.product_id?.name}</td>
                  <td className="p-3">{log.product_id?.price}</td>
                  <td className="p-3 text-center">{log.quantityChange}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3">
                    {log.performedBy?.first_name} - {log.performedBy?.email}
                  </td>
                  <td className="p-3">
                    {new Date(log.updatedAt).toDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
