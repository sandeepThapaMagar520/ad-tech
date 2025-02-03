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

async function fetchKeywordData() {
  const res = await fetch("http://127.0.0.1:8000/get_report/keyword_report", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch keyword data");
  return res.json();
}

export default function PerformanceNestedTable() {
  const [expandedRows, setExpandedRows] = useState<{[key: string]: boolean}>({});
  const [campaignData, setCampaignData] = useState<any[]>([]);
  const [keywordData, setKeywordData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [campaignResults, keywordResults] = await Promise.all([
          fetchCampaignData(),
          fetchKeywordData()
        ]);
        setCampaignData(campaignResults);
        setKeywordData(keywordResults);
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
            <TableHead>Show Details</TableHead>
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
                <TableCell>
                  <button 
                    onClick={() => toggleRowExpansion(campaign.SN)}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    {expandedRows[campaign.SN] ? 'Hide' : 'Show'}
                  </button>
                </TableCell>
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
              {expandedRows[campaign.SN] && (
                <TableRow>
                  <TableCell colSpan={12}>
                    <Table>
                      <TableHeader className="bg-default-100">
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Keyword</TableHead>
                          <TableHead>Match Type</TableHead>
                          <TableHead>Search Term</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Clicks</TableHead>
                          <TableHead>Impressions</TableHead>
                          <TableHead>Sales (30d)</TableHead>
                          <TableHead>Purchases (30d)</TableHead>
                          <TableHead>Top of Search IS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {keywordData
                          // .filter(keyword => keyword.campaignName === campaign.campaignName)
                          .map((keyword) => (
                            <TableRow key={keyword.id}>
                              <TableCell>{keyword.id}</TableCell>
                              <TableCell>{keyword.keyword || "N/A"}</TableCell>
                              <TableCell>{keyword.matchType}</TableCell>
                              <TableCell>{keyword.searchTerm !== "None" ? keyword.searchTerm : "N/A"}</TableCell>
                              <TableCell>₹{parseFloat(keyword.cost).toFixed(2)}</TableCell>
                              <TableCell>{keyword.clicks}</TableCell>
                              <TableCell>{keyword.impressions}</TableCell>
                              <TableCell>₹{parseFloat(keyword.sales30d).toFixed(2)}</TableCell>
                              <TableCell>{keyword.purchases30d}</TableCell>
                              <TableCell>
                                {isNaN(parseFloat(keyword.topOfSearchImpressionShare)) 
                                  ? "N/A" 
                                  : `${parseFloat(keyword.topOfSearchImpressionShare).toFixed(2)}%`}
                              </TableCell>
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