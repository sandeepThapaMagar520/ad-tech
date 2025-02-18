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
      width: 8,
    },
    plotOptions: {
      radialBar: {
        hollow: { size: "80%" },
        dataLabels: {
          value: {
            fontSize: "18px",
            fontWeight: 700,
            color: theme === "dark" ? "#FFF" : "#000",
          },
        },
      },
    },
    colors: [theme === "dark" ? "#A020F0" : "#A020F0"], // Green for dark theme, Orange for light
    labels: ["Progress"], // Custom label for the radial bar
  };

  return (
    <div>
      <Chart options={options} series={series} type="radialBar" height={height} />
    </div>
  );
};

export default BasicRadialBar;
