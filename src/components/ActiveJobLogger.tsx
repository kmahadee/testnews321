/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Terminal, Shield, RefreshCcw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { VideoJob } from '../types';

interface ActiveJobLoggerProps {
  job: VideoJob;
  onClose: () => void;
}

export default function ActiveJobLogger({ job, onClose }: ActiveJobLoggerProps) {
  const terminalRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll terminal log list to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [job.logs]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'failed': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-teal-600 bg-teal-50 border-teal-200';
    }
  };

  return (
    <div id="job_logger_overlay" className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-gray-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gray-900 text-white rounded-lg">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-gray-900 leading-tight">
                Live Automation Pipeline Monitor
              </h3>
              <p className="text-[11px] font-mono text-gray-500 mt-0.5">
                Job ID: {job.id}
              </p>
            </div>
          </div>
          
          <span className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-md border ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
        </div>

        {/* Progress display */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-800">Pipeline Execution Rank Stage</span>
            <span className="text-xs font-mono font-bold text-teal-600">{job.progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>

        {/* Real-time terminal log outputs */}
        <div 
          ref={terminalRef}
          className="flex-1 bg-neutral-950 p-5 font-mono text-[11px] leading-relaxed text-gray-300 overflow-y-auto space-y-2 min-h-[300px] max-h-[450px]"
        >
          <div className="text-neutral-500 border-b border-white/5 pb-2 mb-2 flex items-center justify-between">
            <span>*** AGENT CORE CONSOLE STREAM ***</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" /> Secure Sandbox Channel
            </span>
          </div>

          {job.logs.map((log, idx) => {
            let color = "text-gray-300";
            if (log.toLowerCase().includes('success') || log.toLowerCase().includes('complete')) {
              color = "text-emerald-400 font-semibold";
            } else if (log.toLowerCase().includes('failed') || log.toLowerCase().includes('error')) {
              color = "text-rose-400 font-bold";
            } else if (log.toLowerCase().includes('selected') || log.toLowerCase().includes('ranking')) {
              color = "text-amber-400";
            } else if (log.toLowerCase().includes('querying') || log.toLowerCase().includes('scraping')) {
              color = "text-teal-400";
            }

            return (
              <div key={idx} className={`flex items-start gap-1.5 ${color}`}>
                <span className="text-neutral-600 shrink-0 select-none">[{idx + 1}]</span>
                <span>{log}</span>
              </div>
            );
          })}

          {job.status !== 'completed' && job.status !== 'failed' && (
            <div className="flex items-center gap-2 text-teal-400 animate-pulse pt-2 border-t border-white/5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Pipeline running... Synthesizing multi-model content parameters...</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-150 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-[11px] text-gray-500 font-mono">
            <CheckCircle2 className="w-4 h-4 text-teal-500" /> fully automated cron trigger ready
          </div>

          <button
            id="btn_close_monitor"
            disabled={job.status !== 'completed' && job.status !== 'failed'}
            onClick={onClose}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              job.status === 'completed' || job.status === 'failed'
                ? 'bg-gray-900 text-white hover:bg-black'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {job.status === 'completed' ? 'Proceed to Dashboard' : job.status === 'failed' ? 'Close & Recover' : 'Synthesizing...'}
          </button>
        </div>

      </div>
    </div>
  );
}
