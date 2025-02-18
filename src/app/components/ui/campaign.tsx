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
} from "@/app/components/ui/table";  // Importing Table components
import DateRangePicker from "./datePicker";

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

// Function to fetch campaign data
async function fetchCampaignData() {
  try {
    const res = await fetch("http://127.0.0.1:8000/get_report/campaign_level_table", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch campaign data");
    const data = await res.json();
    console.log("Fetched Campaign Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    throw error;
  }
}

export default function PerformanceTable() {
  const [campaignData, setCampaignData] = useState<CampaignData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      <DateRangePicker 
        startDate={startDate} 
        endDate={endDate} 
        setStartDate={setStartDate} 
        setEndDate={setEndDate} 
      />

      <div className="overflow-x-auto max-h-96 p-5">
        <Table className="">
          <TableHeader >
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
