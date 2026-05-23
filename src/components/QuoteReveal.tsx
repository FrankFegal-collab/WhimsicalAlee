/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle } from 'lucide-react';
import { WHISPER_QUOTES } from '../data/seedData';
import { WhisperQuote } from '../types';

export default function QuoteReveal() {
  const [currentQuote, setCurrentQuote] = useState<WhisperQuote>(() => {
    // Select initial random quote
    const randIndex = Math.floor(Math.random() * WHISPER_QUOTES.length);
    return WHISPER_QUOTES[randIndex];
  });
  const [isRevealing, setIsRevealing] = useState(false);

  const handleRevealNewWhisper = () => {
    setIsRevealing(true);
    // Ensure we don't pick the exact same quote twice in a row if possible
    let nextQuote = currentQuote;
    while (nextQuote.id === currentQuote.id && WHISPER_QUOTES.length > 1) {
      const idx = Math.floor(Math.random() * WHISPER_QUOTES.length);
      nextQuote = WHISPER_QUOTES[idx];
    }
    
    // Simulate a brief "glow reading" period
    setTimeout(() => {
      setCurrentQuote(nextQuote);
      setIsRevealing(false);
    }, 450);
  };

  return (
    <div
      id="whisper-reveal-widget"
      className="relative max-w-xl mx-auto bg-stone-900/40 border border-forest-500/20 rounded-2xl p-6 text-center shadow-lg backdrop-blur-sm overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"></div>
      
      <div className="flex items-center justify-center space-x-1.5 mb-2.5 text-amber-300">
        <Sparkles size={14} className="animate-pulse" />
        <span className="font-fantasy tracking-wider text-xs uppercase text-amber-200">Wind from the Leaves</span>
        <Sparkles size={14} className="animate-pulse" />
      </div>

      <div className="min-h-[110px] flex flex-col justify-center items-center mb-5 px-3">
        <AnimatePresence mode="wait">
          {!isRevealing ? (
            <motion.div
              key={currentQuote.id}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-2"
            >
              <p className="font-serif italic text-lg leading-relaxed text-parchment-100 max-w-md text-center text-glow-cream">
                {currentQuote.text}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-forest-300">
                — {currentQuote.source}
              </p>
            </motion.div>
          ) : (
            <div className="font-serif italic text-stone-500 text-lg flex items-center justify-center space-x-2">
              <span className="animate-bounce delay-100 font-bold">.</span>
              <span className="animate-bounce delay-200 font-bold">.</span>
              <span className="animate-bounce delay-300 font-bold">.</span>
            </div>
          )}
        </AnimatePresence>
      </div>

      <button
        id="reveal-whisper-btn"
        onClick={handleRevealNewWhisper}
        disabled={isRevealing}
        className="relative group inline-flex items-center space-x-2 px-5 py-2.5 bg-forest-800/80 hover:bg-forest-700/90 text-amber-200 border border-amber-500/20 hover:border-amber-400/40 rounded-full font-serif font-medium tracking-wide text-sm transition-all duration-300 shadow-md hover:shadow-glow-amber disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="absolute inset-0 rounded-full bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <HelpCircle size={14} className="text-amber-400 animate-spin-slow group-hover:rotate-45 transition-transform duration-300" />
        <span>Reveal a Whisper</span>
      </button>
    </div>
  );
}
