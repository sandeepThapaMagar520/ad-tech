"use client";  // Add this line at the very top

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
import Header from "@/app/components/ui/header";
import Sidebar from "@/app/components/ui/sidebar"; // Assuming you have a Sidebar component

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

type KeywordData = {
  keyword: string;
  matchTypes: string[];
  bids: number[];
  rank: number;
  theme: string;
};

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

async function fetchAsinData(adGroupId: string): Promise<AsinData[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/get_report/asin_level_table", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch ASIN data");

    const data: AsinData[] = await res.json();
    return data.filter((asin) =>
      String(asin.adGroupId).trim().toLowerCase() === String(adGroupId).trim().toLowerCase()
    );
  } catch (error) {
    console.error("Error fetching ASIN data:", error);
    throw error;
  }
}

async function fetchKeywordData(campaignId: string, adGroupId: string): Promise<KeywordData[]> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/keyword/recommendation/${campaignId}/${adGroupId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch keyword recommendations");

    const data: KeywordData[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching keyword data:", error);
    throw error;
  }
}

async function fetchKeywordPerformance(): Promise<KeywordPerformanceData[]> {
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

        const filteredKeywordPerformance = Array.isArray(keywordPerformance)
          ? keywordPerformance.filter(item => item.Source === "spKeyword")
          : [];
        setKeywordPerformanceData(filteredKeywordPerformance);

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!asinData.length) return <div className="text-red-500">No ASIN data available for this ad group</div>;

  return (
    <div className="flex flex-wrap">
      {/* Sidebar Section */}
      <div className="w-full sm:w-1/4 sidebar">
        <Sidebar campaignId={asinData[0]?.campaignId} adGroupId={asinData[0]?.adGroupId} />
      </div>

      {/* Content Section (Main Table) */}
      <div className="w-full sm:w-3/4 ">
        <button onClick={() => router.back()} className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">
          ← Back
        </button>
        <Header />
        <div className="w-full p-4 rounded-lg bg-gray-800">
          <div className="flex justify-between items-center text-white">
            <div className="text-2xl font-light">
              <h2>Agency name</h2>
            </div>
            <div>
              <h2 className="text-2xl font-light">Brand: brand 1</h2>
              <h2 className="text-2xl font-light">Campaign: </h2>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold mt-6">Keyword Recommendations</h2>
        <div className="table-responsive">
          <Table className="table">
            <TableHeader className="sticky top-0 bg-black text-white">
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
                  <TableCell>{keyword.bids.join(" | ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
