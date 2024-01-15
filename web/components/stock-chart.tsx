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
  datasets: { data: number[]; borderColor: string }[];
}) => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[50rem]">
        <Line
          width={200}
          height={75}
          data={{
            labels,
            datasets,
          }}
        />
      </div>
    </div>
  );
};
export default StockChart;
