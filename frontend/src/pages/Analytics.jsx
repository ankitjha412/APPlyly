import { useEffect, useState } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"];

export default function Analytics() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const evtSource = new EventSourcePolyfill(
      "https://applyly-4r4o.onrender.com/api/analytics/stream",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    evtSource.addEventListener("summary", (e) => {
      setSummary(JSON.parse(e.data));
    });

    evtSource.onerror = (err) => {
      console.error("SSE error:", err);
      evtSource.close();
    };

    return () => evtSource.close();
  }, []);

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="p-6 text-white h-full overflow-y-auto bg-gray-900">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
          <p className="text-sm text-gray-400">Total Candidates</p>
          <p className="text-3xl font-bold">{summary.totalCandidates}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <p className="text-sm text-gray-400">Avg Experience</p>
          <p className="text-3xl font-bold">{summary.avgExperience} yrs</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <p className="text-sm text-gray-400">Min Experience</p>
          <p className="text-3xl font-bold">{summary.minExperience ?? "-"}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-red-500">
          <p className="text-sm text-gray-400">Max Experience</p>
          <p className="text-3xl font-bold">{summary.maxExperience ?? "-"}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Pie Chart */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Candidates by Stage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary.byStage}
                dataKey="count"
                nameKey="status"
                outerRadius={100}
                label
              >
                {summary.byStage.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", color: "#fff" }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Candidates by Role</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.byRole}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="role" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "none", color: "#fff" }} />
              <Legend />
              <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
