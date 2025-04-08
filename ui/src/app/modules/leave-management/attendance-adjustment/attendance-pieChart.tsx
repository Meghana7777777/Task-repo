import dayjs from "dayjs";
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// interface AttendanceData {
//   attnStatus: string;
// }

interface ChartData {
  name: string;
  value: number;
  color: string;
}

// Using only your provided colors
const statusColorMap: Record<string, { color: string; label: string }> = {
  P: { color: "#82bf85", label: "Present" },
  A: { color: "#d9453a", label: "Absent" },
  "P/2": { color: "#FFD700", label: "Half-day Present" },
  CO: { color: "#2196F3", label: "Compensatory Off" },
  TU: { color: "#FF9800", label: "Training" },
  OD: { color: "#9C27B0", label: "On Duty" },
  H: { color: "#a65d5d", label: "Holiday" },
  W: { color: "#9E9E9E", label: "Weekend" },
  WP: { color: "#795548", label: "Weekend Present" },
  "WP/2": { color: "#8D6E63", label: "Weekend Half-day" },
  HP: { color: "#4c4c60", label: "Holiday Present" },
  "HP/2": { color: "#6d7e86", label: "Holiday Half-day" },
};

const AttendancePieChart: React.FC<{ data: any[], branch: any }> = ({ data, branch }) => {
  // Initialize all statuses with count 0
  const attendanceCounts: Record<string, number> = Object.keys(statusColorMap).reduce(
    (acc, key) => ({ ...acc, [key]: 0 }),
    {} as Record<string, number>
  );

  // Count occurrences of each attnStatus
  data.forEach((entry) => {
    if (attendanceCounts.hasOwnProperty(entry.attnStatus)) {
      attendanceCounts[entry.attnStatus] += 1;
    }
  });

  // Prepare chart data
  const chartData: ChartData[] = Object.entries(attendanceCounts).map(([key, value]) => ({
    name: statusColorMap[key].label, // Use full names
    value,
    color: statusColorMap[key].color,
  }));

  // Calculate total users
  const totalUsers = data.length;

  return (
    <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <span><strong style={{ color: 'black' }}>Date:</strong> {dayjs(data[0].attendanceDate).format('ddd, DD-MMM-YYYY')}</span>
        <span><strong style={{ color: 'black' }}>Branch:</strong> {branch}</span>
        <span><strong style={{ color: 'black' }}>Total Users:</strong> {totalUsers}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label={({ name, value }) => (value > 0 ? `${name} (${value})` : "")} // Show labels only if count > 0
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
        <div style={{ marginLeft: "20px" }}>
          <span>Attendance Summary</span>
          <ul>
            {chartData.map((entry, index) => (
              <li key={index} style={{ color: entry.color, fontWeight: entry.value > 0 ? "bold" : "normal" }}>
                {entry.name}: {entry.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AttendancePieChart;
