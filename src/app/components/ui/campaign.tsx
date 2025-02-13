"use client";
import "@/css/global.css"
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
  impression: number
};

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
    <div className="p-5 bg-[#212830]">
      <h1 className="text-xl font-bold mb-4 text-center">Performance Overview</h1>
      <div className="overflow-x-auto max-h-96">
        <Table className="border border-default-100 bg-[#212830] rounded-lg">
          <TableHeader className="bg-black text-white sticky top-0 z-10">
            <TableRow>
              <TableHead className="border border-default-300 text-center rounded-tl-lg">SN</TableHead>
              <TableHead className="border border-default-300 text-center">Campaign</TableHead>
              <TableHead className="border border-default-300 text-center">Ad Group</TableHead>
              <TableHead className="border border-default-300 text-center">Campaign Type</TableHead>
              <TableHead className="border border-default-300 text-center">Revenue</TableHead>
              <TableHead className="border border-default-300 text-center">Spends</TableHead>
              <TableHead className="border border-default-300 text-center">ROAS</TableHead>
              <TableHead className="border border-default-300 text-center">ACOS</TableHead>
              <TableHead className="border border-default-300 text-center">CTR</TableHead>
              <TableHead className="border border-default-300 text-center">clicks</TableHead>
              <TableHead className="border border-default-300 text-center rounded-tr-lg">impressions</TableHead>
              <TableHead className="border border-default-300 text-center rounded-tr-lg">CPC</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody className="bg-[#212830] text-white">
            {campaignData.map((campaign) => (
              <TableRow key={campaign.SN} className="text-center">
                <TableCell className="border border-default-300 rounded-l-lg">{campaign.SN}</TableCell>
                <TableCell className="border border-default-300">{campaign.campaignName}</TableCell>
                <TableCell className="border border-default-300">
                  <Link 
                    href={`/ad/${campaign.campaignId}/${campaign.adGroupId}`} 
                    className="text-blue-600 hover:text-blue-800 hover:underline text-white"
                  >
                    {campaign.adGroupName}
                  </Link>
                </TableCell>
                <TableCell className="border border-default-300">SP</TableCell>
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
