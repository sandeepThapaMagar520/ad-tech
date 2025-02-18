"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import the Chart component to prevent SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BasicRadialBarProps {
  height?: number;
  series: number[];  // Expecting a series prop to be passed
}

const BasicRadialBar = ({ height = 350, series }: BasicRadialBarProps) => {
  const { theme = "light" } = useTheme(); // Default theme fallback

  const options: ApexOptions = {
    chart: {
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth" as "smooth",
      width: 10,
    },
    plotOptions: {
      radialBar: {
        hollow: { size: "50%" },
        dataLabels: {
          name: {
            color: theme === "dark" ? "#FFF" : "#FFF", // Label color dynamically set
          },
          value: {
            fontSize: "18px",
            fontWeight: 700,
            color: theme === "dark" ? "#FFF" : "#FFF",
          },
        },
      },
    },
    colors: ["#800080"],
    labels: ["Total sales"],
  };

  return (
    <div>
      <Chart options={options} series={series} type="radialBar" height={height} />
    </div>
  );
};

export default BasicRadialBar;
