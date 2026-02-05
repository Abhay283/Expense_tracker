import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

export function BarChart({ labels = [], data = [], label = 'Monthly' }) {
  return <Bar data={{ labels, datasets: [{ label, data }] }} options={{ responsive: true }} />;
}

export function PieChart({ labels = [], data = [] }) {
  return <Pie data={{ labels, datasets: [{ data }] }} options={{ responsive: true }} />;
}

export function LineChart({ labels = [], data = [], label = 'Trend' }) {
  return <Line data={{ labels, datasets: [{ label, data, fill: false }] }} options={{ responsive: true }} />;
}
