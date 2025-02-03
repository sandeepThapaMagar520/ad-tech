"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

async function fetchData() {
  const res = await fetch("http://127.0.0.1:8000/get_report/campaign_level_table", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
}

export default async function CampaignNestedTable() {
  const data = await fetchData();

  if (!Array.isArray(data) || data.length === 0) {
    return <h1 className="text-red-500">No data available</h1>;
  }

  return (
    <div className="p-5 font-sans">
      <h1 className="text-xl font-bold mb-4">Ad Campaign Performance</h1>
      <Table>
        <TableHeader className="bg-default-100">
          <TableRow>
            <TableHead>Campaign Overview</TableHead>
            <TableHead>Total Spend</TableHead>
            <TableHead>Total Revenue</TableHead>
            <TableHead>Total Clicks</TableHead>
            <TableHead>Average ROAS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((campaign) => (
            <React.Fragment key={campaign.SN}>
              <TableRow>
                <TableCell colSpan={5}>
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
                      <TableRow>
                        <TableCell>{campaign.SN}</TableCell>
                        <TableCell>{campaign.adGroupName}</TableCell>
                        <TableCell>{campaign.campaignName}</TableCell>
                        <TableCell>${campaign.cost.toFixed(2)}</TableCell>
                        <TableCell>${campaign.costPerClick.toFixed(2)}</TableCell>
                        <TableCell>{(campaign.clickThroughRate * 100).toFixed(2)}%</TableCell>
                        <TableCell>{campaign.clicks}</TableCell>
                        <TableCell>{campaign.purchases1d}</TableCell>
                        <TableCell>${campaign.revenue.toFixed(2)}</TableCell>
                        <TableCell>
                          {campaign.ACoS !== null 
                            ? `${campaign.ACoS.toFixed(2)}%` 
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {campaign.ROAS !== null 
                            ? campaign.ROAS.toFixed(2) 
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}