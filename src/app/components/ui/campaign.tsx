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
};

async function fetchCampaignData() {
  try {
    const res = await fetch("http://127.0.0.1:8000/get_report/campaign_level_table", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch campaign data");
    const data = await res.json();
    console.log("Fetched Campaign Data:", data); // Debugging
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
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Performance Overview</h1>
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Ad Group</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Cost per Click</TableHead>
            <TableHead>CTR</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>ACoS</TableHead>
            <TableHead>ROAS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaignData.map((campaign) => (
            <TableRow key={campaign.SN}>
              <TableCell>{campaign.SN}</TableCell>
              <TableCell>{campaign.campaignName}</TableCell>
              <TableCell>
                <Link 
                  href={`/ad/${campaign.campaignId}/${campaign.adGroupId}`} 
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {campaign.adGroupName}
                </Link>
              </TableCell>
              <TableCell>{campaign.cost}</TableCell>
              <TableCell>{campaign.costPerClick}</TableCell>
              <TableCell>{campaign.clickThroughRate}</TableCell>
              <TableCell>{campaign.clicks}</TableCell>
              <TableCell>{campaign.sales1d}</TableCell>
              <TableCell>{campaign.ACoS}</TableCell>
              <TableCell>{campaign.ROAS}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
