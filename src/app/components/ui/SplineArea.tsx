"use client";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

type ChartData = {
  Date: string;
  DailySales: number;
  Spend: number;
};

type SplineAreaProps = {
  data: ChartData[];
  height?: number;
};

const SplineArea: React.FC<SplineAreaProps> = ({ data, height = 300 }) => {
  const categories = data.map((item) => item.Date);
  const series = [
    { name: "Daily Sales", data: data.map((item) => item.DailySales) },
    { name: "Spend", data: data.map((item) => item.Spend) },
  ];

  const chartOptions: ApexOptions = {
    chart: { type: "area", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 4 },
    colors: ["#F44336", "#2196F3"],
    tooltip: { theme: "dark" },
    xaxis: { categories },
  };

  return <ApexCharts options={chartOptions} series={series} type="area" height={height} width="100%" />;
};

export default SplineArea;
