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
  matchType: string;
  rank: number;
  theme: string;
  bid: number;
};

// Fetch ASIN data based on adGroupId
async function fetchAsinData(adGroupId: string) {
  try {
    console.log("Fetching ASIN Data...");
    const res = await fetch("http://127.0.0.1:8000/get_report/asin_level_table", { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to fetch ASIN data");

    const data = await res.json();
    console.log("Raw ASIN Data:", data);

    if (!Array.isArray(data)) throw new Error("Unexpected ASIN data format");

    const filteredData = data.filter((asin: AsinData) => 
      String(asin.adGroupId).trim().toLowerCase() === String(adGroupId).trim().toLowerCase()
    );

    console.log("Filtered ASIN Data:", filteredData);
    return filteredData;
  } catch (error) {
    console.error("Error fetching ASIN data:", error);
    throw error;
  }
}

// Fetch keyword data based on campaignId and adGroupId
async function fetchKeywordData(campaignId: string, adGroupId: string) {
  try {
    console.log(`Fetching Keyword Data for campaignId=${campaignId}, adGroupId=${adGroupId}`);

    const res = await fetch(`http://127.0.0.1:8000/keyword/recommendation/${campaignId}/${adGroupId}`, { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to fetch keyword recommendations");

    const data = await res.json();
    console.log("Raw Keyword Data:", data);

    if (!Array.isArray(data)) throw new Error("Unexpected Keyword data format");

    return data;
  } catch (error) {
    console.error("Error fetching keyword data:", error);
    throw error;
  }
}

export default function AdGroupPage({ params }: { params: Promise<{ campaign_id: string, ad_group_id: string }> }) {
  const router = useRouter();
  const [asinData, setAsinData] = useState<AsinData[]>([]);
  const [keywordData, setKeywordData] = useState<KeywordData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // We need to unwrap `params` here using React.use()
    const loadData = async () => {
      try {
        const unwrappedParams = await params; // Unwrap the params Promise
        const { ad_group_id } = unwrappedParams;

        if (!ad_group_id) {
          console.error("Ad Group ID is missing!");
          setError("Ad Group ID is missing");
          setIsLoading(false);
          return;
        }

        console.log("Fetching data for Ad Group ID:", ad_group_id);

        // Fetch ASIN data based on adGroupId
        const asinResults = await fetchAsinData(ad_group_id);
        console.log("Filtered ASIN Data:", asinResults);
        setAsinData(asinResults);

        // If we have valid ASIN data, fetch keyword recommendations
        if (asinResults.length > 0) {
          const campaignId = asinResults[0].campaignId;
          console.log("Fetching keyword data for campaignId:", campaignId);
          const keywordResults = await fetchKeywordData(campaignId, ad_group_id);
          setKeywordData(keywordResults);
        } else {
          console.log("No ASIN data found for this Ad Group ID.");
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [params]); // We depend on params, which will now be resolved in the effect

  // Return loading state or error message
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
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>SN</TableHead>
            <TableHead>ASIN</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Campaign Status</TableHead>
            <TableHead>Impressions</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>CTR</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Daily Sales</TableHead>
            <TableHead>ACoS</TableHead>
            <TableHead>ROAS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asinData.map((asin) => (
            <TableRow key={asin.SN}>
              <TableCell>{asin.SN}</TableCell>
              <TableCell>{asin.advertisedAsin}</TableCell>
              <TableCell>{asin.advertisedSku}</TableCell>
              <TableCell>SP</TableCell>
              <TableCell>{asin.campaignStatus}</TableCell>
              <TableCell>{asin.impressions}</TableCell>
              <TableCell>{asin.clicks}</TableCell>
              <TableCell>{asin.clickThroughRate}</TableCell>
              <TableCell>{asin.cost}</TableCell>
              <TableCell>{asin.sales1d}</TableCell>
              <TableCell>{asin.ACoS}</TableCell>
              <TableCell>{asin.ROAS}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Keyword Recommendations Table */}
      <h2 className="text-lg font-bold mt-6">Keyword Recommendations</h2>
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Keyword</TableHead>
            <TableHead>Match Type</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>Theme</TableHead>
            <TableHead>Bid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywordData.map((keyword, index) => (
            <TableRow key={index}>
              <TableCell>{keyword.keyword}</TableCell>
              <TableCell>{keyword.matchType}</TableCell>
              <TableCell>{keyword.rank}</TableCell>
              <TableCell>{keyword.theme}</TableCell>
              <TableCell>{keyword.bid}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
