'use client';

import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

interface QRCodeDisplayProps {
  address: string;
}

export default function QRCodeDisplay({ address }: QRCodeDisplayProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.6 }}
      className="card-brutal p-6 inline-block"
    >
      <div className="bg-white p-4 border-4 border-black">
        <QRCodeSVG
          value={address}
          size={200}
          level="H"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
      <div className="mt-4 text-center font-bold text-sm break-all">
        {address.slice(0, 8)}...{address.slice(-8)}
      </div>
    </motion.div>
  );
}
