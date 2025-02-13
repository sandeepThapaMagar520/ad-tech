"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const COLORS = ["#FFFFFF", "#800080"];

type BrandTargetData = {
  Brand: string;
  DateTime: string;
  DailySales: number;
  Target: number;
  TargetAchieved: number;
  PercentageAchieved?: string;
};

async function fetchFilteredBrandTargetData(startDate: string, endDate: string) {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/get_filtered_brands?start_date=${startDate}&end_date=${endDate}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch filtered brand target data");
    const data = await res.json();
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error("Error fetching brand target data:", error);
    return null;
  }
}

async function fetchUniqueBrandTargetData() {
  try {
    const res = await fetch(
      "http://127.0.0.1:8000/get_unique/brand_level_table",
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch unique brand target data");
    return await res.json();
  } catch (error) {
    console.error("Error fetching unique brand target data:", error);
    return [];
  }
}

export default function BrandTargetTables() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [brandTargetData, setBrandTargetData] = useState<BrandTargetData[] | null>(null);
  const [uniqueBrandTargetData, setUniqueBrandTargetData] = useState<BrandTargetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDataAvailable, setIsDataAvailable] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const uniqueData = await fetchUniqueBrandTargetData();
        setUniqueBrandTargetData(uniqueData);
      } catch (err) {
        console.error("Error loading unique brand data:", err);
      }

      if (startDate && endDate) {
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];
        try {
          const filteredData = await fetchFilteredBrandTargetData(formattedStartDate, formattedEndDate);
          if (filteredData === null) {
            setBrandTargetData([]); // No data for the date range
            setIsDataAvailable(false); // Set flag to false
          } else {
            setBrandTargetData(filteredData); // Set the filtered data
            setIsDataAvailable(true); // Set flag to true
          }
        } catch (err) {
          console.error("Error fetching filtered brand target data:", err);
          setIsDataAvailable(false); // Handle errors gracefully
        } finally {
          setIsLoading(false);
        }
      } else {
        // No date selected, use the unique data
        setBrandTargetData(null); // Clear the filtered data
        setIsDataAvailable(true); // Ensure data is available flag is true
        setIsLoading(false);
      }
    }
    loadData();
  }, [startDate, endDate]);

  if (isLoading) return <div>Loading...</div>;

  const totalTargetAchieved = uniqueBrandTargetData.reduce(
    (acc, brand) => acc + brand.TargetAchieved,
    0
  );

  const topBrands = [...uniqueBrandTargetData]
    .sort((a, b) => b.DailySales - a.DailySales)
    .slice(0, 5);

  const displayData = startDate && endDate ? (brandTargetData || []) : topBrands;

  const BasicRadialBar = ({ percentage }: { percentage: number }) => {
    const { theme = "light" } = useTheme();

    const series = [Math.round(percentage)];

    const options = {
      chart: {
        toolbar: { show: false },
      },
      stroke: {
        curve: "smooth" as "smooth",
        width: 1,
      },
      plotOptions: {
        radialBar: {
          hollow: { size: "40%" }, 
          dataLabels: {
            value: {
              fontSize: "0px",
              fontWeight: 700,
              color: theme === "dark" ? "#FFF" : "#000",
            },
          },
        },
      },
      colors: [theme === "dark" ? "#FFFFFF" : "#800080"], // White and Purple colors
      labels: [Math.round(percentage).toString()],
    };

    return (
      <div className="flex justify-center items-center">
        <Chart options={options} series={series} type="radialBar" height={100} />
      </div>
    );
  };

  const calculatePercentageAchieved = (target: number, targetAchieved: number) => {
    return target > 0 ? ((targetAchieved / target) * 100).toFixed(2) : "0.00";
  };

  return (
    <div className="p-5 space-y-8">
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold">
          Total revenue: INR {totalTargetAchieved.toLocaleString()}
        </h2>
      </div>

      <div className="p-5">
        <h1 className="text-xl font-bold mb-4">Brands</h1>
        <div className="overflow-x-auto">
          <Table className="border border-default-300">
            <TableHeader className="bg-black text-white sticky top-0 z-10">
              <TableRow className="text-center">
                <TableHead className="border border-default-300">Brand</TableHead>
                <TableHead className="border border-default-300">Target</TableHead>
                <TableHead className="border border-default-300">Target Achieved</TableHead>
                <TableHead className="border border-default-300">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto max-h-96">
              {uniqueBrandTargetData.map((brand) => {
                const percentage = brand.Target > 0 ? (brand.TargetAchieved / brand.Target) * 100 : 0;
                return (
                  <TableRow key={`${brand.Brand}-${brand.DateTime}`} className="border border-default-300 text-center">
                    <TableCell className="border border-default-300">{brand.Brand}</TableCell>
                    <TableCell className="border border-default-300">{brand.Target?.toLocaleString() || '-'}</TableCell>
                    <TableCell className="border border-default-300">{brand.TargetAchieved?.toLocaleString() || '-'}</TableCell>
                    <TableCell className="border border-default-300">
                      {brand.Target > 0 ? calculatePercentageAchieved(brand.Target, brand.TargetAchieved) : "0.00"}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="mt-4">
        <label>Start Date</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd HH:mm"
          showTimeSelect
          className="ml-2 p-2 border"
        />
        <label className="ml-4">End Date</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd HH:mm"
          showTimeSelect
          className="ml-2 p-2 border"
        />
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold">Top 5 Brands Based on Daily Sales</h2>
      </div>
      <div className="p-5">
        <Table className="border border-default-300">
          <TableHeader className="bg-black text-white sticky top-0 z-10">
            <TableRow className="text-center">
              <TableHead className="border border-default-300">Brand</TableHead>
              <TableHead className="border border-default-300">Daily Sales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-y-auto max-h-96">
            {displayData.map((brand) => {
              const percentageAchieved = calculatePercentageAchieved(brand.Target, brand.TargetAchieved);
              return (
                <TableRow key={`${brand.Brand}-${brand.DailySales}`} className="border border-default-300 text-center">
                  <TableCell className="border border-default-300">{brand.Brand}</TableCell>
                  <TableCell className="border border-default-300">{brand.DailySales?.toLocaleString() || '-'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Message for No Data Available in Date Range */}
      {!isDataAvailable && startDate && endDate && (
        <div className="text-gray-500 mt-4">
          No data available for the selected date range ({startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}).
        </div>
      )}
    </div>
  );
}
