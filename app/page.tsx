'use client';

import { useState } from 'react';
import AddressInput from '@/components/AddressInput';
import MerchantDashboard from '@/components/MerchantDashboard';

export default function Home() {
  const [merchantAddress, setMerchantAddress] = useState<string | null>(null);

  const handleAddressSubmit = (address: string) => {
    setMerchantAddress(address);
  };

  const handleBack = () => {
    setMerchantAddress(null);
  };

  return (
    <main className="min-h-screen bg-white">
      {!merchantAddress ? (
        <div className="flex items-center justify-center min-h-screen p-6">
          <AddressInput onSubmit={handleAddressSubmit} />
        </div>
      ) : (
        <MerchantDashboard address={merchantAddress} onBack={handleBack} />
      )}
    </main>
  );
}
