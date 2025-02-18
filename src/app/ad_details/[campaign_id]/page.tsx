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
import Header from "@/app/components/ui/header";
import DateRangePicker from "@/app/components/ui/datePicker";
import Sidebar from "@/app/components/ui/sidebar";

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

async function fetchCampaignData(startDate: string | null, endDate: string | null) {
  try {
    const res = await fetch("http://127.0.0.1:8000/get_report/campaign_level_table", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch campaign data");
    const data = await res.json();
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

  // Date Range Picker State
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const startStr = startDate ? startDate.toISOString().split('T')[0] : null;
        const endStr = endDate ? endDate.toISOString().split('T')[0] : null;

        const results = await fetchCampaignData(startStr, endStr);
        setCampaignData(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [startDate, endDate]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!campaignData.length) return <div className="text-red-500">No campaign data available</div>;

  return (
    <div className="p-5">
      
      <Header />
      <div className="w-full p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="text-white text-4xl">
            <h2 className="text-2xl font-light">Agency name</h2>
          </div>
          <div className="text-white">
            <h2 className="text-2xl font-light">Brand: brand 1</h2>
            <h2 className="text-2xl font-light">Campaign: </h2>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-center">Ad Groups</h1>
      <DateRangePicker startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
      <div className="overflow-x-auto max-h-96 p-5">
        <Table className="border border-default-100 rounded-lg">
          <TableHeader className="bg-black text-white  top-0 z-10">
            <TableRow>
              <TableHead className="border border-default-300 text-center">Ad Group</TableHead>
              <TableHead className="border border-default-300 text-center">Ad format</TableHead>
              <TableHead className="border border-default-300 text-center">SKU</TableHead>
              <TableHead className="border border-default-300 text-center">Sales</TableHead>
              <TableHead className="border border-default-300 text-center">Spend</TableHead>
              <TableHead className="border border-default-300 text-center">DRR</TableHead>
              <TableHead className="border border-default-300 text-center">ROAS</TableHead>
              <TableHead className="border border-default-300 text-center">ACOS</TableHead>
              <TableHead className="border border-default-300 text-center">CTR</TableHead>
              <TableHead className="border border-default-300 text-center">Clicks</TableHead>
              <TableHead className="border border-default-300 text-center rounded-tr-lg">Impressions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-white">
            {campaignData.map((campaign) => (
              <TableRow key={campaign.SN} className="text-center">
                <TableCell className="border border-default-300">
                  <Link href={`/adGroupDetails/${campaign.campaignId}/${campaign.adGroupId}/`} className="text-blue-600 hover:text-blue-800 hover:underline">
                    {campaign.adGroupName}
                  </Link>
                </TableCell>
                <TableCell className="border border-default-300">SP</TableCell>
                <TableCell className="border border-default-300">list sku for the ad group</TableCell>
                <TableCell className="border border-default-300">{campaign.sales1d}</TableCell>
                <TableCell className="border border-default-300">{campaign.cost}</TableCell>
                <TableCell className="border border-default-300">{campaign.ROAS}</TableCell>
                <TableCell className="border border-default-300">{campaign.ACoS}</TableCell>
                <TableCell className="border border-default-300">{campaign.clickThroughRate}</TableCell>
                <TableCell className="border border-default-300">{campaign.clicks}</TableCell>
                <TableCell className="border border-default-300 rounded-r-lg">{campaign.impression}</TableCell>
                <TableCell className="border border-default-300 rounded-r-lg">{campaign.costPerClick}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
