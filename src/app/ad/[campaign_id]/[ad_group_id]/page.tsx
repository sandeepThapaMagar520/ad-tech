"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

// Define the type for ASIN data
type AsinData = {
  SN: string;
  advertisedAsin: string;
  advertisedSku: string;
  campaignStatus: string;
  impressions: number;
  clicks: number;
  clickThroughRate: string;
  cost: number;
  sales1d: number;
  ACoS: string;
  ROAS: string;
  adGroupId: string;
  campaignId: string;
};

// Define the type for Keyword data
type KeywordData = {
  keyword: string;
  matchTypes: string[];
  bids: number[];
  rank: number;
  theme: string;
};

// Define type for Keyword Performance data
type KeywordPerformanceData = {
  id: string;
  keyword: string;
  matchType: string;
  searchTerm: string;
  cost: string;
  clicks: number;
  impressions: number;
  sales30d: string;
  purchases30d: number;
  topOfSearchImpressionShare: string;
  Source: string;
  adGroupId: string;
};

// Fetch ASIN data based on adGroupId
async function fetchAsinData(adGroupId: string) {
  try {
    const res = await fetch("http://127.0.0.1:8000/get_report/asin_level_table", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch ASIN data");

    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Unexpected ASIN data format");

    return data.filter((asin: AsinData) =>
      String(asin.adGroupId).trim().toLowerCase() === String(adGroupId).trim().toLowerCase()
    );
  } catch (error) {
    console.error("Error fetching ASIN data:", error);
    throw error;
  }
}

// Fetch keyword recommendations
async function fetchKeywordData(campaignId: string, adGroupId: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/keyword/recommendation/${campaignId}/${adGroupId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch keyword recommendations");

    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Unexpected Keyword data format");

    return data;
  } catch (error) {
    console.error("Error fetching keyword data:", error);
    throw error;
  }
}

// Fetch keyword performance data
async function fetchKeywordPerformance() {
  const res = await fetch("http://127.0.0.1:8000/get_report/keyword_report", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
  return res.json();
}

export default function AdGroupPage({ params }: { params: Promise<{ campaign_id: string, ad_group_id: string }> }) {
  const router = useRouter();
  const [asinData, setAsinData] = useState<AsinData[]>([]);
  const [keywordData, setKeywordData] = useState<KeywordData[]>([]);
  const [keywordPerformanceData, setKeywordPerformanceData] = useState<KeywordPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const unwrappedParams = await params;
        const { ad_group_id } = unwrappedParams;

        if (!ad_group_id) {
          setError("Ad Group ID is missing");
          setIsLoading(false);
          return;
        }

        const [asinResults, keywordPerformance] = await Promise.all([
          fetchAsinData(ad_group_id),
          fetchKeywordPerformance()
        ]);

        setAsinData(asinResults);

        // Filter keyword performance data
        const filteredKeywordPerformance = Array.isArray(keywordPerformance)
          ? keywordPerformance.filter(item => item.Source === "spKeyword")
          : [];
        setKeywordPerformanceData(filteredKeywordPerformance);

        // Fetch keyword recommendations if ASIN data exists
        if (asinResults.length > 0) {
          const campaignId = asinResults[0].campaignId;
          const keywordResults = await fetchKeywordData(campaignId, ad_group_id);
          setKeywordData(keywordResults);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params]);

  if (isLoading) return <div className="p-5">Loading...</div>;
  if (error) return <div className="p-5 text-red-500">Error: {error}</div>;
  if (!asinData.length) return <div className="p-5 text-red-500">No ASIN data available for this ad group</div>;

  return (
    <div className="p-5">
      <button onClick={() => router.back()} className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">
        ← Back
      </button>
      <h1 className="text-xl font-bold">Ad Group Details</h1>

      {/* ASIN Data Table */}
      <h2 className="text-lg font-bold mt-6">ASIN Performance</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>ASIN</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Campaign Status</TableHead>
            <TableHead>Impressions</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>CTR</TableHead>
            <TableHead>Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asinData.map((asin) => (
            <TableRow key={asin.SN}>
              <TableCell>{asin.SN}</TableCell>
              <TableCell>{asin.advertisedAsin}</TableCell>
              <TableCell>{asin.advertisedSku}</TableCell>
              <TableCell>{asin.campaignStatus}</TableCell>
              <TableCell>{asin.impressions}</TableCell>
              <TableCell>{asin.clicks}</TableCell>
              <TableCell>{asin.clickThroughRate}</TableCell>
              <TableCell>{asin.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Keyword Performance Table */}
      <h2 className="text-lg font-bold mt-6">Keyword Performance</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Keyword</TableHead>
            <TableHead>Match Type</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Impressions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywordPerformanceData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.keyword}</TableCell>
              <TableCell>{item.matchType}</TableCell>
              <TableCell>{item.clicks}</TableCell>
              <TableCell>{item.impressions}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Keyword Recommendations Table */}
      <h2 className="text-lg font-bold mt-6">Keyword Recommendations</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Keyword</TableHead>
            <TableHead>Match Types</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>Theme</TableHead>
            <TableHead>Bids</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywordData.map((keyword, index) => (
            <TableRow key={index}>
              <TableCell>{keyword.keyword}</TableCell>
              <TableCell>{keyword.matchTypes.join(", ")}</TableCell>
              <TableCell>{keyword.rank}</TableCell>
              <TableCell>{keyword.theme}</TableCell>
              <TableCell>{keyword.bids.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
