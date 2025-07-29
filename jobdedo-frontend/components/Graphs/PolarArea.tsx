import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import React from "react";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export default function PolarAreaWrapper({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <p>No Jobs Created</p>;
  }

  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label: "Job Created",
        data: data.map((d) => d.jobCount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
        ],
      },
    ],
  };

  return <PolarArea data={chartData} />;
}
