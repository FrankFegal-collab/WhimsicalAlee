/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, Music } from 'lucide-react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [audioSource, setAudioSource] = useState<'stream' | 'synth'>('synth');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // High quality royalty-free loop: Forest nature ambiance
  const STREAM_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'; // soft acoustic melody as fallback

  useEffect(() => {
    // Keep volume in sync
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const stopAllAudio = () => {
    // Stop Audio Element
    if (audioRef.current) {
      audioRef.current.pause();
    }
    // Stop Synth Interval
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    // Close Audio Context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const playSynthBell = (ctx: AudioContext, freq: number, duration: number) => {
    if (!ctx || ctx.state === 'suspended') return;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Add nice high harmonic to make it glassy / fairy bells
    const harmonic = ctx.createOscillator();
    const harmonicGain = ctx.createGain();
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(freq * 2, ctx.currentTime);
    
    // Gain envelop for bell curve
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.12 * volume, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    harmonicGain.gain.setValueAtTime(0, ctx.currentTime);
    harmonicGain.gain.linearRampToValueAtTime(0.04 * volume * 0.5, ctx.currentTime + 0.02);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration * 0.4);

    osc.connect(gainNode);
    harmonic.connect(harmonicGain);
    
    gainNode.connect(ctx.destination);
    harmonicGain.connect(ctx.destination);
    
    osc.start();
    harmonic.start(); 
    
    osc.stop(ctx.currentTime + duration);
    harmonic.stop(ctx.currentTime + duration);
  };

  // Generate continuous procedural wind sounds
  const startProceduralAmbiance = () => {
    if (synthIntervalRef.current) return;
    
    // Create AudioContext if not existing
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Play periodic magical crystal bells
    const pentatonicScales = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]; // C major pentatonic
    
    const playNote = () => {
      const isMutedNow = isMuted;
      if (isMutedNow) return;
      const note = pentatonicScales[Math.floor(Math.random() * pentatonicScales.length)];
      playSynthBell(ctx, note, 2.5 + Math.random() * 2);
    };

    // Play first bell after slight delay
    playNote();

    synthIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.3) {
        playNote();
      }
    }, 3000);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (audioSource === 'stream') {
        if (!audioRef.current) {
          audioRef.current = new Audio(STREAM_URL);
          audioRef.current.loop = true;
        }
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.play().catch(err => {
          console.warn('Audio streaming restricted by browser, switching to synth:', err);
          setAudioSource('synth');
          startProceduralAmbiance();
        });
      } else {
        startProceduralAmbiance();
      }
    }
  };

  const handleChangeSource = (source: 'stream' | 'synth') => {
    setAudioSource(source);
    if (!isPlaying) return;
    
    // Restart audio with new source
    stopAllAudio();
    if (source === 'stream') {
      if (!audioRef.current) {
        audioRef.current = new Audio(STREAM_URL);
        audioRef.current.loop = true;
      }
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play();
    } else {
      startProceduralAmbiance();
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    
    if (audioRef.current) {
      audioRef.current.volume = nextMuted ? 0 : volume;
    }
  };

  return (
    <div
      id="forest-audio-player"
      className="bg-forest-900/85 backdrop-blur-md border border-forest-700/50 rounded-xl p-4 shadow-xl max-w-sm w-full mx-auto"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <span className="relative flex h-3 w-3">
            {isPlaying && !isMuted && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-amber-400' : 'bg-stone-500'}`}></span>
          </span>
          <span className="font-fantasy text-stone-200 text-sm tracking-wider uppercase">
            {isPlaying ? 'Ambiance Alive' : 'Ambiance Asleep'}
          </span>
        </div>
        <div className="flex space-x-1 bg-forest-950/60 p-1 rounded-lg border border-forest-800/40">
          <button
            id="audio-source-synth"
            onClick={() => handleChangeSource('synth')}
            className={`px-2.5 py-1 rounded text-xs transition duration-200 font-sans flex items-center space-x-1 ${
              audioSource === 'synth'
                ? 'bg-forest-700/80 text-amber-300 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Procedural Synthesis"
          >
            <Sparkles size={11} />
            <span>Synth Bells</span>
          </button>
          <button
            id="audio-source-stream"
            onClick={() => handleChangeSource('stream')}
            className={`px-2.5 py-1 rounded text-xs transition duration-200 font-sans flex items-center space-x-1 ${
              audioSource === 'stream'
                ? 'bg-forest-700/80 text-amber-300 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Mild Nature Lullaby Stream"
          >
            <Music size={11} />
            <span>Forest Lullaby</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Play/Pause Button */}
        <button
          id="audio-play-toggle"
          onClick={handleTogglePlay}
          className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying 
              ? 'bg-amber-500 hover:bg-amber-400 text-forest-950 shadow-glow-amber scale-105' 
              : 'bg-forest-700 hover:bg-forest-600 text-stone-100'
          }`}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} className="translate-x-0.5" fill="currentColor" />}
        </button>

        {/* Volume slider & mute control */}
        <div className="flex-grow flex items-center space-x-3.5">
          <button
            id="audio-mute-toggle"
            onClick={handleToggleMute}
            className="text-stone-300 hover:text-amber-300 transition duration-200"
          >
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <input
            id="audio-volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            style={{
              background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${volume * 100}%, #1a3c24 ${volume * 100}%, #1a3c24 100%)`
            }}
            className="h-1.5 rounded-full flex-grow appearance-none cursor-pointer accent-amber-500 focus:outline-none"
            aria-label="Forest audio volume slider"
          />
        </div>
      </div>
      
      {isPlaying && (
        <div className="mt-2.5 flex justify-center items-center h-2 space-x-1 opacity-60">
          <span className="w-1 bg-amber-400 rounded-sm animate-pulse" style={{ height: '5px', animationDuration: '0.8s' }}></span>
          <span className="w-1 bg-amber-400 rounded-sm animate-pulse" style={{ height: '8px', animationDuration: '1.2s' }}></span>
          <span className="w-1 bg-amber-400 rounded-sm animate-pulse" style={{ height: '6px', animationDuration: '1.0s' }}></span>
          <span className="w-1 bg-amber-400 rounded-sm animate-pulse" style={{ height: '9px', animationDuration: '0.7s' }}></span>
          <span className="w-1 bg-amber-400 rounded-sm animate-pulse" style={{ height: '4px', animationDuration: '1.4s' }}></span>
        </div>
      )}
    </div>
  );
}
