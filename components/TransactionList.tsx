'use client';

import { motion } from 'framer-motion';
import { TransactionInfo } from '@/lib/solana';

interface TransactionListProps {
  transactions: TransactionInfo[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatAmount = (amount: number | null) => {
    if (amount === null) return 'N/A';
    return `${amount.toFixed(4)} SOL`;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold mb-6">Transaction Feed</h2>
      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <motion.div
            key={tx.signature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`card-brutal p-4 ${
              tx.type === 'incoming' ? 'bg-white' : 'bg-white'
            }`}
            whileHover={{ scale: 1.02, x: 2, y: 2, boxShadow: 'none' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 border-2 border-black ${
                    tx.type === 'incoming' ? 'bg-black' : 'bg-white'
                  }`}
                />
                <span className="font-bold text-lg">
                  {tx.type === 'incoming' && '↓ '}
                  {tx.type === 'outgoing' && '↑ '}
                  {tx.type === 'unknown' && '• '}
                  {tx.type.toUpperCase()}
                </span>
              </div>
              <span className="font-bold">{formatAmount(tx.amount)}</span>
            </div>
            <div className="text-sm font-medium opacity-70">
              {formatTimestamp(tx.timestamp)}
            </div>
            <div className="text-xs font-mono mt-2 break-all opacity-50">
              {tx.signature.slice(0, 20)}...
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
