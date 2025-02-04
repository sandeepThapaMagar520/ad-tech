"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

async function fetchCampaignData() {
  const res = await fetch("http://127.0.0.1:8000/get_report/campaign_level_table", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch campaign data");
  return res.json();
}

async function fetchAsinData() {
  const res = await fetch("http://127.0.0.1:8000/get_report/asin_level_table", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch ASIN data");
  return res.json();
}

export default function PerformanceNestedTable() {
  const [expandedRows, setExpandedRows] = useState<{[key: string]: boolean}>({});
  const [campaignData, setCampaignData] = useState<any[]>([]);
  const [asinData, setAsinData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [campaignResults, asinResults] = await Promise.all([
          fetchCampaignData(),
          fetchAsinData()
        ]);
        setCampaignData(campaignResults);
        setAsinData(asinResults);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!campaignData.length) return <div className="text-red-500">No campaign data available</div>;

  return (
    <div className="p-5 font-sans">
      <h1 className="text-xl font-bold mb-4">Performance Overview</h1>
      <Table>
        <TableHeader className="bg-default-100">
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>Ad Group</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Cost per Click</TableHead>
            <TableHead>CTR</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Purchases</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>ACoS</TableHead>
            <TableHead>ROAS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaignData.map((campaign) => (
            <React.Fragment key={campaign.SN}>
              <TableRow>
                <TableCell>{campaign.SN}</TableCell>
                <TableCell 
                  onClick={() => toggleRowExpansion(campaign.SN)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <span className="mr-2">
                      {expandedRows[campaign.SN] ? '▼' : '▶'}
                    </span>
                    {campaign.adGroupName}
                  </div>
                </TableCell>
                <TableCell>{campaign.campaignName}</TableCell>
                <TableCell>{campaign.cost}</TableCell>
                <TableCell>{campaign.costPerClick}</TableCell>
                <TableCell>{campaign.clickThroughRate}</TableCell>
                <TableCell>{campaign.clicks}</TableCell>
                <TableCell>{campaign.purchases1d}</TableCell>
                <TableCell>{campaign.sales1d}</TableCell>
                <TableCell>{campaign.ACoS}</TableCell>
                <TableCell>{campaign.ROAS}</TableCell>
              </TableRow>
              {expandedRows[campaign.SN] && (
                <TableRow>
                  <TableCell colSpan={11}>
                    <Table>
                      <TableHeader className="bg-default-100">
                        <TableRow>
                          <TableHead>SN</TableHead>
                          <TableHead>ASIN</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Campaign Status</TableHead>
                          <TableHead>Impressions</TableHead>
                          <TableHead>Clicks</TableHead>
                          <TableHead>CTR</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Sales (1d)</TableHead>
                          <TableHead>Purchases (1d)</TableHead>
                          <TableHead>ACoS</TableHead>
                          <TableHead>ROAS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {asinData
                          .filter(asin => asin.adGroupId === campaign.adGroupId)
                          .map((asin) => (
                            <TableRow key={asin.SN}>
                              <TableCell>{asin.SN}</TableCell>
                              <TableCell>{asin.advertisedAsin}</TableCell>
                              <TableCell>{asin.advertisedSku}</TableCell>
                              <TableCell>{asin.campaignStatus}</TableCell>
                              <TableCell>{asin.impressions}</TableCell>
                              <TableCell>{asin.clicks}</TableCell>
                              <TableCell>{asin.clickThroughRate}</TableCell>
                              <TableCell>{asin.cost}</TableCell>
                              <TableCell>{asin.sales1d}</TableCell>
                              <TableCell>{asin.purchases1d}</TableCell>
                              <TableCell>{asin.ACoS}</TableCell>
                              <TableCell>{asin.ROAS}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}