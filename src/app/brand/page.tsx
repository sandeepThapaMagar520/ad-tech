"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type BrandTargetData = {
  Brand: string;
  DateTime: string;
  DailySales: number;
  Target: number;
  TargetAchieved: number;
  PercentageAchieved?: string;
};

async function fetchBrandTargetData() {
  try {
    const res = await fetch("http://127.0.0.1:8000/get_report/brand_level_table", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch brand target data");
    const data = await res.json();
    console.log("Fetched Brand Target Data:", data);
    return data as BrandTargetData[];
  } catch (error) {
    console.error("Error fetching brand target data:", error);
    throw error;
  }
}

const COLORS = ["#00C49F", "#FF8042"];

export default function BrandTargetTable() {
  const [brandTargetData, setBrandTargetData] = useState<BrandTargetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const results = await fetchBrandTargetData();
        console.log("Fetched Brand Target Data in useEffect:", results);

        const latestUniqueBrands = Object.values(
          results.reduce((acc, brand) => {
            if (!acc[brand.Brand] || new Date(brand.DateTime) > new Date(acc[brand.Brand].DateTime)) {
              acc[brand.Brand] = brand;
            }
            return acc;
          }, {} as Record<string, BrandTargetData>)
        );

        setBrandTargetData(latestUniqueBrands);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!brandTargetData.length) return <div className="text-red-500">No brand target data available</div>;

  const totalDailySales = brandTargetData.reduce((acc, brand) => acc + brand.DailySales, 0);

  // Get top performing brands based on latest DailySales
  const topBrands = [...brandTargetData]
    .sort((a, b) => b.DailySales - a.DailySales)
    .slice(0, 5);

  return (
    <div className="p-5">
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-bold">Total Daily Sales: INR {totalDailySales.toLocaleString()}</h2>
      </div>
      <h1 className="text-xl font-bold mb-4">Brand Target Overview</h1>
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Brand</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Target Achieved</TableHead>
            <TableHead>Percentage Achieved</TableHead>
            <TableHead>Progress</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brandTargetData.map((brand) => {
            const pieChartData = [
              { name: "Target Achieved", value: brand.TargetAchieved },
              { name: "Remaining Target", value: brand.Target - brand.TargetAchieved },
            ];
            return (
              <TableRow key={brand.Brand}>
                <TableCell>{brand.Brand}</TableCell>
                <TableCell>{brand.Target.toLocaleString()}</TableCell>
                <TableCell>{brand.TargetAchieved.toLocaleString()}</TableCell>
                <TableCell>{brand.PercentageAchieved}</TableCell>
                <TableCell>
                  <div className="w-32 h-32">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={20}
                          outerRadius={30}
                          fill="#82ca9d"
                        >
                          {pieChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <h2 className="text-lg font-bold mt-6">Top Performing Brands (Daily Sales)</h2>
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Brand</TableHead>
            <TableHead>Daily Sales</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topBrands.map((brand) => (
            <TableRow key={brand.Brand}>
              <TableCell>{brand.Brand}</TableCell>
              <TableCell>{brand.DailySales.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
