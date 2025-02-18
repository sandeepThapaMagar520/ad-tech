"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const Sidebar = dynamic(() => import('@/app/components/ui/sidebar'), { ssr: false });

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import Header from '@/app/components/ui/header';

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

export default function AsinPage() {
  const [asinData, setAsinData] = useState<AsinData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAsinData = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/get_report/asin_level_table');
        if (!res.ok) throw new Error('Failed to fetch ASIN data');
        const data = await res.json();
        setAsinData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadAsinData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex">
      <Sidebar campaignId={''} adGroupId={''} />
      <div className="flex-1 p-5">
        <Header />
        <h1 className="text-2xl font-bold">ASIN Performance</h1>
        <Table className="border border-default-300">
          <TableHeader className="bg-black text-white sticky top-0 z-10">
            <TableRow>
              <TableHead className="border border-default-300">ASIN</TableHead>
              <TableHead className="border border-default-300">SKU</TableHead>
              <TableHead className="border border-default-300">Campaign Status</TableHead>
              <TableHead className="border border-default-300">Revenue</TableHead>
              <TableHead className="border border-default-300">Spend</TableHead>
              <TableHead className="border border-default-300">ACOS</TableHead>
              <TableHead className="border border-default-300">ROAS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asinData.map((asin) => (
              <TableRow key={asin.SN} className="text-center">
                <TableCell className="border border-default-300">{asin.advertisedAsin}</TableCell>
                <TableCell className="border border-default-300">{asin.advertisedSku}</TableCell>
                <TableCell className="border border-default-300">{asin.campaignStatus}</TableCell>
                <TableCell className="border border-default-300">{asin.impressions}</TableCell>
                <TableCell className="border border-default-300">{asin.clicks}</TableCell>
                <TableCell className="border border-default-300">{asin.clickThroughRate}</TableCell>
                <TableCell className="border border-default-300">{asin.cost}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
