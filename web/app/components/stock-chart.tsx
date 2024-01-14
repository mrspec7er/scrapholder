"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const StockChart = ({
  labels,
  datasets,
}: {
  labels: string[];
  datasets: { data: number[]; backgroundColor: string }[];
}) => {
  return (
    <div>
      <Line
        data={{
          labels,
          datasets,
        }}
      />
    </div>
  );
};
export default StockChart;
