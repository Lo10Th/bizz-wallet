'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="w-16 h-16 border-4 border-black rounded-full border-t-transparent"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        style={{
          borderRadius: '50% 45% 50% 45%',
        }}
      />
    </div>
  );
}
