"use client"; // Ensure this file is treated as a client-side component

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type SidebarProps = {
  campaignId: string;
  adGroupId: string;
};

export default function Sidebar({ campaignId, adGroupId }: SidebarProps) {
  const [isClient, setIsClient] = useState(false); // Track if we are on the client side
  const router = useRouter(); // Hook to handle routing

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  // Navigate to the ASIN page with the same campaignId and adGroupId
  const navigateToAsin = () => {
    router.push(`/adGroupDetails/${campaignId}/${adGroupId}/asin`);
  };

  // Navigate to the Targeting page with the same campaignId and adGroupId
  const navigateToTargeting = () => {
    router.push(`/adGroupDetails/${campaignId}/${adGroupId}/targeting`);
  };

  // Navigate to the Recommendation page with the same campaignId and adGroupId
  const navigateToRecommendation = () => {
    router.push(`/adGroupDetails/${campaignId}/${adGroupId}/recommendation`);
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
      <ul>
        <li>
          <button
            onClick={navigateToAsin}
            className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
          >
            ASIN Performance
          </button>
        </li>
        <li>
          <button
            onClick={navigateToRecommendation}
            className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
          >
            Keyword Recommendations
          </button>
        </li>
        <li>
          <button
            onClick={navigateToTargeting}
            className="w-full text-left py-2 px-4 hover:bg-gray-700 rounded"
          >
            Targeting
          </button>
        </li>
      </ul>
    </div>
  );
}
