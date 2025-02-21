"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import DateRangePicker from "./datePicker";
import SplineArea from "./SplineArea";

// Types for Table and Chart Data
type CampaignData = {
  SN: string;
  campaignId: string;
  campaignName: string;
  adGroupId: string;
  adGroupName: string;
  cost: number;
  costPerClick: number;
  clickThroughRate: string;
  clicks: number;
  sales1d: number;
  ACoS: string;
  ROAS: string;
  campaign_type: string;
  impression: number;
};

type ChartData = {
  Date: string;
  DailySales: number;
  Spend: number;
};

// Fetch campaign table data
async function fetchCampaignData() {
  try {
    const res = await fetch("http://127.0.0.1:8000/get_report/campaign_level_table", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch campaign data");
    return await res.json();
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    return [];
  }
}

// Fetch chart data
async function fetchCampaignDataChart() {
  try {
    const res = await fetch("http://127.0.0.1:8000/get_report/campaign_data", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch chart data");
    return await res.json();
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
}

export default function PerformanceTable() {
  const [campaignData, setCampaignData] = useState<CampaignData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartError, setChartError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const results = await fetchCampaignData();
        setCampaignData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadChartData() {
      try {
        const results = await fetchCampaignDataChart();
        setChartData(results);
      } catch (err) {
        setChartError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setChartLoading(false);
      }
    }
    loadChartData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!campaignData.length) return <div className="text-red-500">No campaign data available</div>;

  return (
    <div className="p-5">
      <div className="w-full p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="text-white text-4xl">
            <h2 className="text-4xl font-light">Agency name</h2>
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-light">Brand: brand 1</h2>
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">List of Campaigns</h1>
       {/* AREA CHART SECTION */}
      {chartLoading ? (
        <div>Loading chart...</div>
      ) : chartError ? (
        <div className="text-red-500">{chartError}</div>
      ) : (
        <SplineArea data={chartData} height={350} />
      )}
      <DateRangePicker 
        startDate={startDate} 
        endDate={endDate} 
        setStartDate={setStartDate} 
        setEndDate={setEndDate} 
      />

      <div className="overflow-x-auto max-h-96 p-5">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">SN</TableHead>
              <TableHead className="text-center">Campaign</TableHead>
              <TableHead className="text-center">Campaign Type</TableHead>
              <TableHead className="text-center">Sales</TableHead>
              <TableHead className="text-center">Goal</TableHead>
              <TableHead className="text-center">Spend</TableHead>
              <TableHead className="text-center">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-[#212830] text-white">
            {campaignData.map((campaign) => (
              <TableRow key={campaign.SN} className="text-center">
                <TableCell className="rounded-l-lg">{campaign.SN}</TableCell>
                <TableCell>
                  <Link href={`/ad_details/${campaign.campaignId}`}>
                    {campaign.campaignName}
                  </Link>
                </TableCell>
                <TableCell>SP</TableCell>
                <TableCell>{campaign.sales1d}</TableCell>
                <TableCell>10000</TableCell>
                <TableCell>200</TableCell>
                <TableCell>32%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

     
    </div>
  );
}
