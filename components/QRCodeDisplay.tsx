'use client';

import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { createSolanaPaymentRequest } from '@/lib/solana';

interface QRCodeDisplayProps {
  address: string;
  amount?: number | null;
}

export default function QRCodeDisplay({ address, amount }: QRCodeDisplayProps) {
  const hasAmount = typeof amount === 'number' && Number.isFinite(amount);
  const paymentRequest = hasAmount
    ? createSolanaPaymentRequest(address, amount)
    : `solana:${address}`;
  const formattedAmount = hasAmount ? amount.toFixed(4) : null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.6 }}
      className="card-brutal p-6 inline-block"
    >
      <div className="bg-white p-4 border-4 border-black">
        <QRCodeSVG
          value={paymentRequest}
          size={200}
          level="H"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
      <div className="mt-4 text-center font-bold text-sm">
        {hasAmount ? `PAY ${formattedAmount} SOL` : 'ENTER AMOUNT TO CREATE PAYMENT'}
      </div>
      <div className="mt-1 text-center text-xs font-medium break-all opacity-70">
        {address.slice(0, 8)}...{address.slice(-8)}
      </div>
    </motion.div>
  );
}
