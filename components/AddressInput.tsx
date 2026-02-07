'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { isValidSolanaAddress } from '@/lib/solana';

interface AddressInputProps {
  onSubmit: (address: string) => void;
}

export default function AddressInput({ onSubmit }: AddressInputProps) {
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address.trim()) {
      setError('Please enter a Solana address');
      return;
    }

    if (!isValidSolanaAddress(address.trim())) {
      setError('Invalid Solana address');
      return;
    }

    onSubmit(address.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      className="w-full max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-6xl font-bold mb-8 text-center"
          >
            SOLANA POS
            <br />
            <span className="text-4xl">SHADOW</span>
          </motion.h1>

          <motion.input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter Solana Public Address..."
            className="input-brutal w-full text-center text-lg"
            whileFocus={{ scale: 1.02 }}
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-white border-4 border-black text-center font-bold"
            >
              {error}
            </motion.div>
          )}
        </div>

        <motion.button
          type="submit"
          className="btn-brutal w-full text-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ENTER MERCHANT DASHBOARD
        </motion.button>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-sm font-medium opacity-70"
      >
        Example: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
      </motion.div>
    </motion.div>
  );
}
