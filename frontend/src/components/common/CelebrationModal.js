'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Trophy, Check } from 'lucide-react';

export default function CelebrationModal({ isOpen, onClose, vehicleName }) {
  // Auto-close after 5 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-2xl animate-fade-in"
          >
            {/* Background glowing particles/confetti simulation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: -20, 
                    x: Math.random() * 400 - 200, 
                    opacity: 1, 
                    scale: Math.random() * 0.6 + 0.4,
                    rotate: 0 
                  }}
                  animate={{ 
                    y: 400, 
                    x: Math.random() * 400 - 200,
                    opacity: 0,
                    rotate: 360 
                  }}
                  transition={{ 
                    duration: Math.random() * 2 + 2, 
                    repeat: Infinity, 
                    delay: Math.random() * 0.5 
                  }}
                  className={`absolute w-3 h-3 rounded-sm ${
                    i % 3 === 0 ? 'bg-[#FF6500]' : i % 3 === 1 ? 'bg-orange-500' : 'bg-white'
                  }`}
                  style={{ top: 0, left: '50%' }}
                />
              ))}
            </div>

            {/* Trophy Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-400 to-[#FF6500] shadow-lg text-white mb-6"
            >
              <Trophy className="h-8 w-8" />
            </motion.div>

            {/* Congratulatory Text */}
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-extrabold uppercase tracking-wide text-white"
            >
              Acquisition Confirmed!
            </motion.h3>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-sm text-zinc-400 font-light"
            >
              Congratulations! You are now the owner of:
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-3 text-lg font-bold text-[#FF6500] italic font-mono uppercase bg-zinc-900/80 py-2.5 px-4 rounded-xl border border-zinc-800 inline-block"
            >
              {vehicleName}
            </motion.div>

            {/* Animated Car sliding across road track */}
            <div className="relative mt-8 h-16 w-full overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800/80 flex flex-col justify-end">
              {/* Road line */}
              <div className="absolute inset-x-0 bottom-4 h-0.5 border-t border-dashed border-zinc-800" />
              
              {/* Speed lines */}
              <div className="absolute inset-0 flex items-center justify-around pointer-events-none opacity-40">
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 300 }}
                    animate={{ x: -100 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
                    className="w-8 h-0.5 bg-zinc-800"
                  />
                ))}
              </div>

              {/* Driving Car */}
              <motion.div
                initial={{ x: -60 }}
                animate={{ x: 420 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-2 left-0"
              >
                <div className="flex items-center text-accent">
                  <Car className="h-8 w-8 text-[#FF6500] drop-shadow-[0_0_6px_rgba(255,101,0,0.4)] animate-bounce" style={{ animationDuration: '0.4s' }} />
                </div>
              </motion.div>
            </div>

            {/* Confirm button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={onClose}
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-orange-500 to-[#FF6500] py-3 text-sm font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Let's Drive</span>
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
