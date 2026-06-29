/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Sliders, Layers } from 'lucide-react';
import { GeneratedScript } from '../types';

interface ReelSimulatorProps {
  content: GeneratedScript;
}

export default function ReelSimulator({ content }: ReelSimulatorProps) {
  const { headline, scriptText, slides } = content;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  
  // Ref for progress animation
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const durationMs = 30000; // Simulated duration: 30 seconds

  // Speech synthesis variables
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Word highlighting
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = scriptText.split(' ');
  
  // Total words sync over 30 seconds
  const msPerWord = durationMs / words.length;

  // Active slide changes based on time
  const slideCount = slides.length;
  const msPerSlide = durationMs / slideCount;

  // Speech Synth voice matching Kore etc.
  const handleTTSNarration = (textToSpeak: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel(); // clear previous

    if (isMuted) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    // Find a nice natural English voice
    const voices = synthRef.current.getVoices();
    const premiumVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || 
                         voices.find(v => v.lang.startsWith('en')) || 
                         voices[0];
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }
    utterance.rate = 1.05; // Slightly fast, exciting narrator speed
    utterance.pitch = 1.0;
    
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      // Pause
      setIsPlaying(false);
      if (synthRef.current) {
        synthRef.current.pause();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      // Play
      setIsPlaying(true);
      startTimeRef.current = performance.now() - (progress / 100) * durationMs;

      // Unmute trigger to play narration
      if (!isMuted) {
        const remainingText = words.slice(currentWordIndex).join(' ');
        handleTTSNarration(remainingText);
      }

      const animate = (time: number) => {
        if (!startTimeRef.current) startTimeRef.current = time;
        const elapsed = time - startTimeRef.current;
        const nextProgress = Math.min((elapsed / durationMs) * 100, 100);
        
        setProgress(nextProgress);

        // Update active slide
        const nextSlideIndex = Math.min(Math.floor((nextProgress / 100) * slideCount), slideCount - 1);
        setCurrentSlideIndex(nextSlideIndex);

        // Update word index
        const nextWordIndex = Math.min(Math.floor((nextProgress / 100) * words.length), words.length - 1);
        setCurrentWordIndex(nextWordIndex);

        if (nextProgress < 100) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsPlaying(false);
          setProgress(100);
          setCurrentWordIndex(words.length - 1);
          if (synthRef.current) {
            synthRef.current.cancel();
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const handleRestart = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (synthRef.current) synthRef.current.cancel();
    
    setProgress(0);
    setCurrentSlideIndex(0);
    setCurrentWordIndex(0);
    setIsPlaying(false);
    
    if (!isMuted) {
      // Quick restart voice cue
    }
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (synthRef.current) {
      if (nextMuted) {
        synthRef.current.cancel();
      } else if (isPlaying) {
        const remainingText = words.slice(currentWordIndex).join(' ');
        handleTTSNarration(remainingText);
      }
    }
  };

  useEffect(() => {
    // Initial cleanup
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const activeSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div id="reel_sim_card" className="flex flex-col xl:flex-row gap-6 p-6 bg-white border border-gray-100 rounded-2xl shadow-xs">
      
      {/* 1. Portrait Video Render Stage */}
      <div className="relative mx-auto xl:mx-0 w-[300px] h-[533px] bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-900 group">
        
        {/* Active Stock Frame (Zoom Transition) */}
        <div className="absolute inset-0 transition-all duration-1000 ease-out transform scale-102 overflow-hidden">
          <img 
            src={activeSlide.imageFallbackUrl} 
            alt={activeSlide.title}
            className="w-full h-full object-cover opacity-80 filter brightness-45 contrast-105 select-none animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/80" />
        </div>

        {/* Video Canvas Graphic Assets (Decorative status bars) */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600 rounded-md text-[10px] font-mono tracking-widest text-white uppercase font-bold shadow-xs">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-0.5" />
            Active Reel
          </div>
          <div className="text-[10px] font-mono text-gray-400 bg-black/60 px-2 py-1 rounded-sm tracking-wider">
            1080 x 1920 | 30 FPS
          </div>
        </div>

        {/* Top News Badge Banner Overlay */}
        <div className="absolute top-16 left-4 right-4 z-10 text-center bg-black/40 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
          <h4 className="text-white text-[12px] font-display font-medium tracking-tight truncate leading-tight uppercase text-teal-400">
            {headline}
          </h4>
        </div>

        {/* Dynamic Interactive Slide HUD Frame */}
        <div className="absolute inset-x-6 top-32 bottom-28 flex flex-col justify-center text-center z-10 pb-4">
          <div className="space-y-3 animate-fade-in">
            {/* Slide title */}
            <h5 className="text-[14px] uppercase font-mono tracking-wider text-teal-300 font-semibold drop-shadow-md">
              [ Slide {currentSlideIndex + 1} / {slideCount} ]
            </h5>
            <h2 className="text-xl md:text-2xl font-display font-bold text-white leading-tight tracking-tight drop-shadow-lg px-2">
              {activeSlide.title}
            </h2>
            <p className="text-[11px] text-gray-300 px-3 line-clamp-3 leading-relaxed drop-shadow-md font-sans">
              {activeSlide.text}
            </p>
          </div>
        </div>

        {/* Real-time Subtitles Script Word highlight Overlay (Reel/Shorts style) */}
        <div className="absolute inset-x-4 bottom-14 z-10 bg-black/60 backdrop-blur-xs py-3 px-4 rounded-xl border border-white/5 text-center min-h-[4.5rem] flex items-center justify-center">
          <div className="text-[13px] leading-tight text-white/95 font-display font-semibold transition-all duration-150">
            {words.map((word, idx) => {
              const startIdx = Math.max(0, currentWordIndex - 2);
              const endIdx = Math.min(words.length, currentWordIndex + 3);
              if (idx < startIdx || idx >= endIdx) return null;
              
              const isCurrent = idx === currentWordIndex;
              return (
                <span 
                  key={idx} 
                  className={`inline-block mx-0.5 px-0.5 rounded transition-all duration-150 ${
                    isCurrent 
                      ? 'text-yellow-300 text-[15px] font-bold bg-yellow-950/40 border-b-2 border-yellow-400 scale-105' 
                      : 'text-gray-300 opacity-60 font-medium'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>

        {/* Video progress indicator bar */}
        <div className="absolute bottom-1.5 inset-x-4 h-1.5 bg-white/20 rounded-full overflow-hidden z-10">
          <div 
            className="h-full bg-teal-400 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Floating audio spectrum visualizer (Simulated) */}
        {isPlaying && (
          <div className="absolute bottom-8 right-6 z-10 flex items-end gap-0.5 h-6 opacity-85">
            {[...Array(6)].map((_, i) => {
              const h = [10, 24, 16, 28, 12, 20][i];
              return (
                <div 
                  key={i} 
                  className="w-1 bg-teal-400 rounded-full animate-bounce"
                  style={{ 
                    height: `${h}px`,
                    animationDelay: `${i * 120}ms`,
                    animationDuration: '600ms'
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Side Panel Controllers & Script Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-3 gap-3">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-gray-400">Media Generation Result</span>
              <h3 className="text-lg font-display font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-teal-500" />
                Playable Video Sandbox
              </h3>
            </div>

            {/* Micro Player Controls */}
            <div className="flex items-center gap-2">
              <button 
                id="btn_restart_video"
                onClick={handleRestart}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button 
                id="btn_toggle_play"
                onClick={handleTogglePlay}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm border transition-all ${
                  isPlaying 
                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                    : 'bg-teal-500 text-white hover:bg-teal-600 border-teal-600'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> Narration Play
                  </>
                )}
              </button>

              <button 
                id="btn_mute"
                onClick={handleMuteToggle}
                className={`p-2 rounded-lg border transition-colors ${
                  isMuted 
                    ? 'bg-rose-50 text-rose-600 border-rose-200' 
                    : 'text-gray-400 hover:text-gray-900 border-gray-100'
                }`}
                title={isMuted ? "Unmute vocal" : "Mute vocal"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Progress overview banner */}
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-[10px] font-mono uppercase text-gray-400">Aspect Ratio</div>
              <div className="text-xs font-bold text-gray-800 mt-0.5">9:16 Vertical</div>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-[10px] font-mono uppercase text-gray-400">Est. Duration</div>
              <div className="text-xs font-bold text-gray-800 mt-0.5">30.0 Seconds</div>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-[10px] font-mono uppercase text-gray-400">Narration Voice</div>
              <div className="text-xs font-bold text-teal-600 @semibold mt-0.5 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                {content.voiceVoice || "Kore (TTS)"}
              </div>
            </div>
          </div>

          {/* Script Content Block */}
          <div className="space-y-1.5 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <Sliders className="w-3 h-3" /> Transcribed Speech Script (Voice-Over)
            </span>
            <p className="text-xs italic text-gray-700 leading-relaxed max-h-[160px] overflow-y-auto pr-1">
              "{scriptText}"
            </p>
          </div>

          {/* Visual Slide Thumbnails preview */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Active Slide Breakdown & Keywords
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {slides.map((sl, index) => {
                const isActive = index === currentSlideIndex;
                return (
                  <button
                    key={sl.id}
                    id={`btn_select_slide_${index}`}
                    onClick={() => {
                      setCurrentSlideIndex(index);
                      // Move timeline to slide start
                      const pct = (index / slideCount) * 100;
                      setProgress(pct);
                      setCurrentWordIndex(Math.floor((index / slideCount) * words.length));
                    }}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border text-left transition-all ${
                      isActive 
                        ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/15' 
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={sl.imageFallbackUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-gray-400">FRAME {index + 1}</div>
                      <div className="text-[11px] font-bold text-gray-800 truncate leading-tight mt-0.5">{sl.title}</div>
                      <div className="text-[9px] font-mono text-teal-600 truncate mt-0.5 uppercase tracking-wide">#{sl.imageKeyword.split(' ')[0]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100 text-[11px] text-gray-400 font-mono flex items-center justify-between">
          <span>* Click play to hear narration synthesized dynamically by WebSpeech APIs.</span>
          <span className="text-gray-300">Format: MP4 Container</span>
        </div>
      </div>

    </div>
  );
}
