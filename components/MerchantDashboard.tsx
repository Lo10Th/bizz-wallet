'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getBalance, getRecentTransactions, TransactionInfo } from '@/lib/solana';
import BalanceCounter from './BalanceCounter';
import TransactionList from './TransactionList';
import QRCodeDisplay from './QRCodeDisplay';
import LoadingSpinner from './LoadingSpinner';

interface MerchantDashboardProps {
  address: string;
  onBack: () => void;
}

export default function MerchantDashboard({ address, onBack }: MerchantDashboardProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<TransactionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentQrAmount, setPaymentQrAmount] = useState<number | null>(null);
  const [amountError, setAmountError] = useState('');

  const handlePaymentSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setAmountError('');

    const trimmedAmount = paymentAmount.trim();
    if (!trimmedAmount) {
      setAmountError('Please enter an amount');
      return;
    }

    const parsedAmount = Number(trimmedAmount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setAmountError('Enter a valid amount');
      return;
    }

    setPaymentQrAmount(parsedAmount);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [balanceData, txData] = await Promise.all([
          getBalance(address),
          getRecentTransactions(address, 10),
        ]);

        setBalance(balanceData);
        setTransactions(txData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <LoadingSpinner />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl font-bold"
        >
          Loading merchant data...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card-brutal p-8 max-w-lg text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Error</h2>
          <p className="font-medium mb-6">{error}</p>
          <motion.button
            onClick={onBack}
            className="btn-brutal"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            GO BACK
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 flex items-center justify-between"
        >
          <h1 className="text-4xl font-bold">MERCHANT DASHBOARD</h1>
          <motion.button
            onClick={onBack}
            className="btn-brutal"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← BACK
          </motion.button>
        </motion.div>

        {/* Balance Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card-brutal p-8 mb-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">BALANCE</h2>
          {balance !== null && <BalanceCounter value={balance} />}
        </motion.div>

        {/* QR Code and Transactions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QR Code */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 flex justify-center"
          >
            <div className="w-full max-w-sm space-y-6">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="card-brutal p-6"
              >
                <h2 className="text-2xl font-bold mb-4 text-center">CREATE PAYMENT</h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <input
                    type="number"
                    min="0"
                    step="0.0001"
                    inputMode="decimal"
                    value={paymentAmount}
                    onChange={(event) => {
                      setPaymentAmount(event.target.value);
                      setAmountError('');
                    }}
                    placeholder="Amount in SOL"
                    className="input-brutal w-full text-center text-lg"
                  />
                  <motion.button
                    type="submit"
                    className="btn-brutal w-full text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    GENERATE PAYMENT QR
                  </motion.button>
                </form>
                {amountError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-white border-4 border-black text-center font-bold"
                  >
                    {amountError}
                  </motion.div>
                )}
              </motion.div>
              <div className="flex justify-center">
                <QRCodeDisplay address={address} amount={paymentQrAmount} />
              </div>
            </div>
          </motion.div>

          {/* Transaction List */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <TransactionList transactions={transactions} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
