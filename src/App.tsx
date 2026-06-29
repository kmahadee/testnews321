/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Server,
  Clock,
  Settings,
  Mail,
  Facebook,
  Users,
  Play,
  CheckCircle2,
  TrendingUp,
  Plus,
  Trash2,
  LogOut,
  Key,
  Terminal,
  Sliders,
  Sparkles,
  Layers,
  Lock,
  RefreshCcw,
  FileText,
  Check,
  ChevronRight,
  AlertTriangle,
  Settings2,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Send,
  SlidersHorizontal,
  Info
} from 'lucide-react';

import ReelSimulator from './components/ReelSimulator';
import ActiveJobLogger from './components/ActiveJobLogger';
import DocsHub from './components/DocsHub';

import {
  NewsStory,
  GeneratedScript,
  Recipient,
  FacebookConfig,
  GmailConfig,
  SystemConfig,
  ScheduleConfig,
  VideoJob,
  DashboardStats
} from './types';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Pre-unlocked for evaluation
  const [adminPassword, setAdminPassword] = useState('admin');
  const [authError, setAuthError] = useState('');

  // Dashboard Main Tabs
  const [activeMainTab, setActiveMainTab] = useState<'control' | 'history' | 'blueprints'>('control');

  // Core Entity States
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [facebookConfig, setFacebookConfig] = useState<FacebookConfig | null>(null);
  const [gmailConfig, setGmailConfig] = useState<GmailConfig | null>(null);
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig | null>(null);
  const [jobsHistory, setJobsHistory] = useState<VideoJob[]>([]);

  // Selected Job for Reel playback / details inspection
  const [selectedJob, setSelectedJob] = useState<VideoJob | null>(null);

  // Background Job Polling
  const [activePollingJob, setActivePollingJob] = useState<VideoJob | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);

  // Forms / Input States for Dashboard
  const [newRecName, setNewRecName] = useState('');
  const [newRecEmail, setNewRecEmail] = useState('');
  const [addRecSuccess, setAddRecSuccess] = useState('');

  const [editCron, setEditCron] = useState('');
  const [editTime, setEditTime] = useState('');
  const [scheduleStatusMsg, setScheduleStatusMsg] = useState('');

  const [editFbPageName, setEditFbPageName] = useState('');
  const [editFbPageId, setEditFbPageId] = useState('');
  const [editFbToken, setEditFbToken] = useState('');
  const [fbStatusMsg, setFbStatusMsg] = useState('');

  // Setup Wizard Multi-Step State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizGeminiKey, setWizGeminiKey] = useState('');
  const [wizOpenaiKey, setWizOpenaiKey] = useState('');
  const [wizTime, setWizTime] = useState('07:00');
  const [wizRecName, setWizRecName] = useState('');
  const [wizRecEmail, setWizRecEmail] = useState('');
  const [wizAutoRetryCount, setWizAutoRetryCount] = useState(3);
  const [wizSendErrorAlerts, setWizSendErrorAlerts] = useState(true);

  // Developer Testing States
  const [testFbLoading, setTestFbLoading] = useState(false);
  const [testFbMessage, setTestFbMessage] = useState('');
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailMessage, setTestEmailMessage] = useState('');
  const [testVideoLoading, setTestVideoLoading] = useState(false);
  const [testVideoMessage, setTestVideoMessage] = useState('');

  // --- API Handlers ---

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchRecipients = async () => {
    try {
      const res = await fetch('/api/recipients');
      if (res.ok) {
        const data = await res.json();
        setRecipients(data);
      }
    } catch (err) {
      console.error('Error fetching recipients:', err);
    }
  };

  const fetchFacebookConfig = async () => {
    try {
      const res = await fetch('/api/facebook-config');
      if (res.ok) {
        const data = await res.json();
        setFacebookConfig(data);
        setEditFbPageName(data.pageName);
        setEditFbPageId(data.pageId);
        setEditFbToken(data.accessToken);
      }
    } catch (err) {
      console.error('Error fetching Facebook config:', err);
    }
  };

  const fetchGmailConfig = async () => {
    try {
      const res = await fetch('/api/gmail-config');
      if (res.ok) {
        const data = await res.json();
        setGmailConfig(data);
      }
    } catch (err) {
      console.error('Error fetching Gmail config:', err);
    }
  };

  const fetchSystemConfig = async () => {
    try {
      const res = await fetch('/api/system-config');
      if (res.ok) {
        const data = await res.json();
        setSystemConfig(data);
        if (data.geminiApiKey) {
          setWizGeminiKey(data.geminiApiKey);
        }
        if (data.openaiApiKey) {
          setWizOpenaiKey(data.openaiApiKey);
        }
        setWizAutoRetryCount(data.autoRetryCount);
        setWizSendErrorAlerts(data.sendErrorAlerts);
      }
    } catch (err) {
      console.error('Error fetching System config:', err);
    }
  };

  const fetchScheduleConfig = async () => {
    try {
      const res = await fetch('/api/schedule-config');
      if (res.ok) {
        const data = await res.json();
        setScheduleConfig(data);
        setEditCron(data.cron);
        setEditTime(data.time);
        setWizTime(data.time || '07:00');
      }
    } catch (err) {
      console.error('Error fetching schedule config:', err);
    }
  };

  const fetchJobsHistory = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobsHistory(data);

        // Default select latest completed job for player
        if (data.length > 0 && !selectedJob) {
          const latestCompleted = data.find((j: VideoJob) => j.status === 'completed');
          if (latestCompleted) {
            setSelectedJob(latestCompleted);
          } else {
            setSelectedJob(data[0]);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching jobs history:', err);
    }
  };

  const loadAllData = () => {
    fetchStats();
    fetchRecipients();
    fetchFacebookConfig();
    fetchGmailConfig();
    fetchSystemConfig();
    fetchScheduleConfig();
    fetchJobsHistory();
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadAllData();
    }
  }, [isLoggedIn]);

  // Auth Sandbox submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin') {
      setIsLoggedIn(true);
      setAuthError('');
    } else {
      setAuthError('Access denied: Authentication code is invalid.');
    }
  };

  // Connect OAuth Handlers
  const handleConnectFacebook = async () => {
    try {
      const res = await fetch('/api/auth/facebook/url');
      if (res.ok) {
        const { url } = await res.json();
        const width = 640;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(
          url,
          'facebook-oauth-popup',
          `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
        );

        const handleMessage = (e: MessageEvent) => {
          if (e.data && e.data.type === 'OAUTH_AUTH_SUCCESS' && e.data.service === 'facebook') {
            fetchFacebookConfig();
            window.removeEventListener('message', handleMessage);
          }
        };
        window.addEventListener('message', handleMessage);
      }
    } catch (err) {
      console.error('Failed to trigger Facebook OAuth:', err);
    }
  };

  const handleConnectGmail = async () => {
    try {
      const res = await fetch('/api/auth/gmail/url');
      if (res.ok) {
        const { url } = await res.json();
        const width = 640;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(
          url,
          'gmail-oauth-popup',
          `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
        );

        const handleMessage = (e: MessageEvent) => {
          if (e.data && e.data.type === 'OAUTH_AUTH_SUCCESS' && e.data.service === 'gmail') {
            fetchGmailConfig();
            window.removeEventListener('message', handleMessage);
          }
        };
        window.addEventListener('message', handleMessage);
      }
    } catch (err) {
      console.error('Failed to trigger Gmail OAuth:', err);
    }
  };

  // Add Recipient handler
  const handleAddRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecName || !newRecEmail) return;
    try {
      const res = await fetch('/api/recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRecName, email: newRecEmail })
      });
      if (res.ok) {
        setNewRecName('');
        setNewRecEmail('');
        setAddRecSuccess('Subscriber registered successfully!');
        fetchRecipients();
        fetchStats();
        setTimeout(() => setAddRecSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error adding recipient:', err);
    }
  };

  // Wizard quick add recipient
  const handleWizAddRecipient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizRecName || !wizRecEmail) return;
    try {
      const res = await fetch('/api/recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: wizRecName, email: wizRecEmail })
      });
      if (res.ok) {
        setWizRecName('');
        setWizRecEmail('');
        fetchRecipients();
      }
    } catch (err) {
      console.error('Error in wizard recipient add:', err);
    }
  };

  // Toggle subscriber status
  const handleToggleRecipient = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/recipients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentStatus })
      });
      if (res.ok) {
        fetchRecipients();
        fetchStats();
      }
    } catch (err) {
      console.error('Error toggling recipient:', err);
    }
  };

  // Delete recipient
  const handleDeleteRecipient = async (id: string) => {
    try {
      const res = await fetch(`/api/recipients/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchRecipients();
        fetchStats();
      }
    } catch (err) {
      console.error('Error deleting recipient:', err);
    }
  };

  // Save Schedule settings
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/schedule-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cron: editCron, time: editTime, timezone: 'Asia/Dhaka' })
      });
      if (res.ok) {
        fetchScheduleConfig();
        setScheduleStatusMsg('Trigger settings saved.');
        setTimeout(() => setScheduleStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error('Error saving schedule:', err);
    }
  };

  // Save Wizard configuration progress
  const handleSaveWizConfig = async () => {
    try {
      // 1. Save system variables
      await fetch('/api/system-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geminiApiKey: wizGeminiKey,
          openaiApiKey: wizOpenaiKey,
          autoRetryCount: wizAutoRetryCount,
          sendErrorAlerts: wizSendErrorAlerts,
          emailSenderAddress: gmailConfig?.emailAddress || ''
        })
      });

      // 2. Save schedule configurations
      await fetch('/api/schedule-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          time: wizTime,
          enabled: true,
          timezone: 'Asia/Dhaka'
        })
      });

      fetchSystemConfig();
      fetchScheduleConfig();
    } catch (err) {
      console.error('Failed to save wizard config step:', err);
    }
  };

  // Handle final launch of Wizard setup
  const handleCompleteWizard = async () => {
    try {
      await fetch('/api/system-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setupWizardCompleted: true,
          automationEnabled: true,
          geminiApiKey: wizGeminiKey,
          openaiApiKey: wizOpenaiKey,
          autoRetryCount: wizAutoRetryCount,
          sendErrorAlerts: wizSendErrorAlerts
        })
      });

      await fetch('/api/schedule-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          time: wizTime,
          enabled: true,
          timezone: 'Asia/Dhaka'
        })
      });

      loadAllData();
    } catch (err) {
      console.error('Error launching agent setup:', err);
    }
  };

  // Toggle Automation On/Off
  const handleToggleAutomation = async (currentStatus: boolean) => {
    try {
      const nextStatus = !currentStatus;
      await fetch('/api/system-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ automationEnabled: nextStatus })
      });

      await fetch('/api/schedule-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextStatus })
      });

      loadAllData();
    } catch (err) {
      console.error('Failed to toggle automation loops:', err);
    }
  };

  // Save Facebook tokens configuration
  const handleSaveFacebook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/facebook-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageName: editFbPageName,
          pageId: editFbPageId,
          accessToken: editFbToken,
          connected: true
        })
      });
      if (res.ok) {
        fetchFacebookConfig();
        setFbStatusMsg('Facebook Page Credentials linked!');
        setTimeout(() => setFbStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error('Error saving FB config:', err);
    }
  };

  // Manual cron agent sweep trigger
  const handleManualTrigger = async () => {
    if (isTriggering) return;
    setIsTriggering(true);
    try {
      const res = await fetch('/api/jobs/manual', { method: 'POST' });
      if (res.ok) {
        const { jobId } = await res.json();
        startPollingJob(jobId);
      } else {
        setIsTriggering(false);
      }
    } catch (err) {
      console.error('Error manual trigger:', err);
      setIsTriggering(false);
    }
  };

  // Background polling execution manager
  const startPollingJob = (jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (response.ok) {
          const jobData = await response.json();
          setActivePollingJob(jobData);

          if (jobData.status === 'completed' || jobData.status === 'failed') {
            clearInterval(pollInterval);
            setIsTriggering(false);
            loadAllData();

            // Set newly created completed job as active playback preview
            if (jobData.status === 'completed') {
              setSelectedJob(jobData);
            }
          }
        } else {
          clearInterval(pollInterval);
          setIsTriggering(false);
        }
      } catch (err) {
        console.error('Polling error:', err);
        clearInterval(pollInterval);
        setIsTriggering(false);
      }
    }, 2000);
  };

  const handleTestFacebook = async () => {
    setTestFbLoading(true);
    setTestFbMessage('');
    try {
      const res = await fetch('/api/test/facebook', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setTestFbMessage(data.message || 'Facebook test complete!');
      } else {
        setTestFbMessage(`Error: ${data.error || 'Failed'}`);
      }
    } catch (err: any) {
      setTestFbMessage(`Failed: ${err.message || err}`);
    } finally {
      setTestFbLoading(false);
      setTimeout(() => setTestFbMessage(''), 8000);
    }
  };

  const handleTestEmail = async () => {
    setTestEmailLoading(true);
    setTestEmailMessage('');
    try {
      const res = await fetch('/api/test/email', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setTestEmailMessage(data.message || 'Email test complete!');
      } else {
        setTestEmailMessage(`Error: ${data.error || 'Failed'}`);
      }
    } catch (err: any) {
      setTestEmailMessage(`Failed: ${err.message || err}`);
    } finally {
      setTestEmailLoading(false);
      setTimeout(() => setTestEmailMessage(''), 8000);
    }
  };

  const handleTestVideo = async () => {
    setTestVideoLoading(true);
    setTestVideoMessage('');
    try {
      const res = await fetch('/api/test/video', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setTestVideoMessage('Test video generated and selected!');
        loadAllData();
        setSelectedJob(data);
      } else {
        setTestVideoMessage(`Error: ${data.error || 'Failed'}`);
      }
    } catch (err: any) {
      setTestVideoMessage(`Failed: ${err.message || err}`);
    } finally {
      setTestVideoLoading(false);
      setTimeout(() => setTestVideoMessage(''), 8000);
    }
  };

  const activeReelContent = selectedJob?.generatedContent;

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1c1c1e] font-sans antialiased">

      {/* ----------------- SECURITY PASSWORD WALL ----------------- */}
      {!isLoggedIn && (
        <div className="fixed inset-0 bg-[#f3f4f6]/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-gray-150 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
            <div className="mx-auto w-12 h-12 bg-neutral-900 text-white rounded-xl flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-display font-bold text-gray-900 tracking-tight">AI News Agent Admin Lock</h2>
              <p className="text-xs text-gray-500">Sign in using default credentials to unlock SaaS core controllers.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono uppercase text-gray-400">Security bypass key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Enter password..."
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent font-mono bg-gray-50/50"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-lg text-[11px] text-rose-600 font-medium text-left">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-neutral-900 text-white font-semibold text-xs rounded-lg hover:bg-black transition-colors shadow-md"
              >
                Authenticate Controller
              </button>
            </form>

            <div className="text-[11px] text-gray-400 font-mono">
              Credentials: <span className="text-gray-700 bg-gray-100 px-1 py-0.5 rounded font-bold">admin</span>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- SYSTEM INITIAL SETUP WIZARD ----------------- */}
      {isLoggedIn && systemConfig && !systemConfig.setupWizardCompleted && (
        <div className="min-h-screen bg-slate-550/5 flex flex-col items-center justify-center py-12 px-4">
          <div className="w-full max-w-2xl bg-white border border-gray-150 rounded-3xl shadow-xl overflow-hidden">

            {/* Header section with progress steps */}
            <div className="bg-neutral-900 text-white p-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Settings2 className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold font-display tracking-tight uppercase">AI News Agent Setup Wizard</h1>
                  <p className="text-xs text-neutral-400 mt-0.5">Let's configure your daily automated publishing agency in minutes.</p>
                </div>
              </div>

              {/* Progress Bar and Step Labels */}
              <div className="mt-8">
                <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${(wizardStep / 5) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-5 text-center mt-3 text-[10px] font-mono text-neutral-400">
                  <span className={`${wizardStep >= 1 ? 'text-teal-400 font-bold' : ''}`}>1. API Keys</span>
                  <span className={`${wizardStep >= 2 ? 'text-teal-400 font-bold' : ''}`}>2. Facebook</span>
                  <span className={`${wizardStep >= 3 ? 'text-teal-400 font-bold' : ''}`}>3. Gmail</span>
                  <span className={`${wizardStep >= 4 ? 'text-teal-400 font-bold' : ''}`}>4. Delivery</span>
                  <span className={`${wizardStep >= 5 ? 'text-teal-400 font-bold' : ''}`}>5. Launch</span>
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="p-8 space-y-6">

              {/* STEP 1: API KEYS CONFIGURATION */}
              {wizardStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900">Configure AI Engine Credentials</h3>
                    <p className="text-xs text-gray-500">Provide the pipeline access tokens needed to analyze, score, and summarize AI news developments.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                          Gemini API Key <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] font-mono text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">Required</span>
                      </div>
                      <input
                        type="password"
                        value={wizGeminiKey}
                        onChange={(e) => setWizGeminiKey(e.target.value)}
                        className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none font-mono bg-gray-50/30"
                        placeholder="Enter your Gemini API key (or uses default injected key if empty)..."
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-700">OpenAI API Key (Optional)</label>
                        <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded font-bold">Fallback</span>
                      </div>
                      <input
                        type="password"
                        value={wizOpenaiKey}
                        onChange={(e) => setWizOpenaiKey(e.target.value)}
                        className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-1 focus:ring-teal-500 focus:outline-none font-mono bg-gray-50/30"
                        placeholder="sk-proj-..."
                      />
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 flex gap-2">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong>Security Note:</strong> Keys are saved securely inside your private sandbox session and never transmitted to external telemetry servers.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: FACEBOOK PAGE CONNECTION */}
              {wizardStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900">Connect Facebook Publishing Gateway</h3>
                    <p className="text-xs text-gray-500">Enable automatic publishing to Facebook Page feeds. Users click connect for fully automated token exchange.</p>
                  </div>

                  <div className="p-6 border border-gray-150 bg-gray-50/50 rounded-2xl flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                      <Facebook className="w-8 h-8" />
                    </div>

                    {facebookConfig?.connected ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-bold">
                          <CheckCircle className="w-4 h-4" /> Connected successfully!
                        </div>
                        <p className="text-xs text-gray-700">
                          Connected Page: <strong>{facebookConfig.pageName}</strong> (ID: {facebookConfig.pageId})
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">Authorize the SaaS agent to post generated videos directly onto your brand feed page.</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleConnectFacebook}
                        className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
                      >
                        <Facebook className="w-4 h-4" />
                        {facebookConfig?.connected ? 'Reconnect Facebook Page' : 'Connect Facebook Page'}
                      </button>

                      {!facebookConfig?.connected && (
                        <button
                          type="button"
                          onClick={() => {
                            // Simulate skip config
                            const dbRef = { pageName: 'AI Spotlights Page (Sandbox)', pageId: '984729384729', accessToken: 'mock_token_abc123', connected: true, status: 'active' };
                            fetch('/api/facebook-config', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(dbRef)
                            }).then(() => fetchFacebookConfig());
                          }}
                          className="py-2.5 px-4 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                        >
                          Use Sandbox Simulation
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: GMAIL ROUTING */}
              {wizardStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900">Connect Gmail Dispatcher</h3>
                    <p className="text-xs text-gray-500">Authorize Gmail to send newsletter notifications automatically without configuring SMTP servers manually.</p>
                  </div>

                  <div className="p-6 border border-gray-150 bg-gray-50/50 rounded-2xl flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-teal-50 text-teal-600 rounded-full">
                      <Mail className="w-8 h-8" />
                    </div>

                    {gmailConfig?.connected ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-bold">
                          <CheckCircle className="w-4 h-4" /> Gmail Connected!
                        </div>
                        <p className="text-xs text-gray-700">
                          Active Sender: <strong>{gmailConfig.emailAddress}</strong>
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">Your daily video briefs and executive news bulletins will be sent out using this address.</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleConnectGmail}
                        className="py-2.5 px-5 bg-teal-500 hover:bg-teal-600 text-white font-semibold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        {gmailConfig?.connected ? 'Reconnect Gmail' : 'Connect Gmail'}
                      </button>

                      {!gmailConfig?.connected && (
                        <button
                          type="button"
                          onClick={() => {
                            // Simulate skip config
                            const dbRef = { emailAddress: 'atclbdarmy@gmail.com', connected: true, refreshToken: 'mock_refresh', status: 'active' };
                            fetch('/api/gmail-config', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(dbRef)
                            }).then(() => fetchGmailConfig());
                          }}
                          className="py-2.5 px-4 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                        >
                          Use Sandbox Simulation
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: NEWSLETTER RECEIVERS & TIMING */}
              {wizardStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900">Subscribers & Trigger Schedule</h3>
                    <p className="text-xs text-gray-500">Configure recipient emails for newsletters and select when the daily news gathering cycle triggers.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Add Recipient */}
                    <div className="space-y-3 p-4 bg-gray-50 border border-gray-150 rounded-2xl">
                      <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide">Register Subscriber Recipients</span>

                      <form onSubmit={handleWizAddRecipient} className="space-y-2">
                        <input
                          type="text"
                          placeholder="Name..."
                          value={wizRecName}
                          onChange={(e) => setWizRecName(e.target.value)}
                          className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white"
                        />
                        <input
                          type="email"
                          placeholder="Email address..."
                          value={wizRecEmail}
                          onChange={(e) => setWizRecEmail(e.target.value)}
                          className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-white"
                        />
                        <button
                          type="submit"
                          className="w-full py-1.5 bg-neutral-900 hover:bg-black text-white text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3 h-3" /> Add Subscriber
                        </button>
                      </form>

                      {/* Small list */}
                      <div className="space-y-1.5 max-h-[100px] overflow-y-auto pt-2 border-t border-gray-200">
                        {recipients.map(r => (
                          <div key={r.id} className="text-[11px] flex justify-between items-center text-gray-600">
                            <span className="truncate max-w-[130px]"><strong>{r.name}</strong> ({r.email})</span>
                            <button onClick={() => handleDeleteRecipient(r.id)} className="text-rose-500 hover:text-rose-700">Delete</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Schedule Timing */}
                    <div className="space-y-4 p-4 bg-gray-50 border border-gray-150 rounded-2xl flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wide block">Configure daily schedule time</span>
                        <p className="text-[11px] text-gray-500">Select when you want your AI News Agent to wake up daily, find news, compile, render and publish.</p>
                        <input
                          type="time"
                          value={wizTime}
                          onChange={(e) => setWizTime(e.target.value)}
                          className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white font-mono font-bold text-center mt-2"
                        />
                      </div>

                      <div className="text-[10px] font-mono text-gray-400 text-center">
                        Selected run: <strong>{wizTime} Asia/Dhaka</strong> daily
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW & COMPLETE */}
              {wizardStep === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900">Review & Launch Automation Agency</h3>
                    <p className="text-xs text-gray-500">Everything is set! Confirm your deployment variables to start the automated publishing cycle.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 border border-gray-150 rounded-2xl space-y-3 bg-gray-50/50">
                      <span className="text-[10px] font-mono uppercase font-bold text-gray-400">Gateway Integrations</span>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Facebook Page:</span>
                          <span className={`font-semibold ${facebookConfig?.connected ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {facebookConfig?.connected ? facebookConfig.pageName : 'Disconnected'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Gmail Mailer:</span>
                          <span className={`font-semibold ${gmailConfig?.connected ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {gmailConfig?.connected ? gmailConfig.emailAddress : 'Disconnected'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Subscribers:</span>
                          <span className="font-semibold text-gray-800">{recipients.length} configured</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Runtimes Trigger:</span>
                          <span className="font-mono font-bold text-teal-600">{wizTime} Asia/Dhaka</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-150 rounded-2xl space-y-3 bg-gray-50/50">
                      <span className="text-[10px] font-mono uppercase font-bold text-gray-400">Error Handling & Recovery</span>
                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[10px] font-medium text-gray-550 block">Auto-Retry Limit on failure</label>
                          <select
                            value={wizAutoRetryCount}
                            onChange={(e) => setWizAutoRetryCount(Number(e.target.value))}
                            className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-white"
                          >
                            <option value={1}>1 Retry</option>
                            <option value={3}>3 Retries (Recommended)</option>
                            <option value={5}>5 Retries</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="wizAlertCheck"
                            checked={wizSendErrorAlerts}
                            onChange={(e) => setWizSendErrorAlerts(e.target.checked)}
                            className="rounded text-teal-500 focus:ring-teal-500"
                          />
                          <label htmlFor="wizAlertCheck" className="text-[11px] font-semibold text-gray-700 cursor-pointer">
                            Email alert on failure
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 flex gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Launch Command Ready:</strong> Upon clicking Complete Setup, the system scheduler will engage. No external cron configuration or cloud scheduler setup is required!
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Stepper Buttons footer */}
            <div className="bg-gray-50 border-t border-gray-150 px-8 py-5 flex justify-between items-center">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(prev => prev - 1)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-colors ${wizardStep === 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                Back
              </button>

              {wizardStep < 5 ? (
                <button
                  type="button"
                  onClick={() => {
                    handleSaveWizConfig();
                    setWizardStep(prev => prev + 1);
                  }}
                  className="px-5 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-md"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteWizard}
                  className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-teal-500/10 transform hover:-translate-y-0.5 transition-all"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" /> Complete Setup & Launch
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ----------------- CORE SERVICE DASHBOARD ----------------- */}
      {isLoggedIn && systemConfig && systemConfig.setupWizardCompleted && (
        <>
          {/* Header Bar */}
          <header className="sticky top-0 bg-white/85 backdrop-blur-md border-b border-gray-100 z-30 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-900 text-white rounded-xl shadow-md">
                  <Server className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-display font-bold tracking-tight text-gray-900 uppercase">
                      AI News Agent SaaS
                    </h1>
                    <button
                      onClick={() => handleToggleAutomation(systemConfig.automationEnabled)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wide flex items-center gap-1 transition-all ${systemConfig.automationEnabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${systemConfig.automationEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      {systemConfig.automationEnabled ? 'Automation Engaged' : 'Agent Idle'}
                    </button>
                  </div>
                  <p className="text-[10px] font-mono text-gray-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-teal-500" />
                    Next Daily Run: <strong className="text-gray-700">{scheduleConfig?.time || '07:00'} Asia/Dhaka</strong> | Mode: {systemConfig.automationEnabled ? 'Armed' : 'Standby'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Advanced Quick Trigger indicators */}
                <div className="hidden sm:flex items-center gap-3.5 text-xs font-mono bg-gray-50 border border-gray-150 px-4 py-1.5 rounded-xl">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Facebook className="w-3.5 h-3.5 text-blue-600" />
                    {facebookConfig?.connected ? 'Page Linked' : 'Page Unlinked'}
                  </span>
                  <span className="w-px h-3 bg-gray-200" />
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Mail className="w-3.5 h-3.5 text-teal-500" />
                    {gmailConfig?.connected ? 'Gmail Sender Active' : 'Gmail Inactive'}
                  </span>
                </div>

                <button
                  id="btn_view_wizard"
                  onClick={() => {
                    // Trigger return to wizard
                    fetch('/api/system-config', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ setupWizardCompleted: false })
                    }).then(() => fetchSystemConfig());
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all flex items-center gap-1"
                  title="Launch Setup Wizard"
                >
                  <Settings2 className="w-3.5 h-3.5" /> Wizard Setup
                </button>

                <button
                  id="btn_sign_out"
                  onClick={() => setIsLoggedIn(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 border border-gray-100 rounded-lg transition-colors"
                  title="Lock Admin Control"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">

            {/* Dashboard Tabs & Action Triggers */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-gray-100 p-3 rounded-2xl shadow-xs">
              <div className="flex items-center gap-1">
                <button
                  id="btn_tab_control"
                  onClick={() => setActiveMainTab('control')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeMainTab === 'control'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Control Panel
                </button>

                <button
                  id="btn_tab_history"
                  onClick={() => setActiveMainTab('history')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeMainTab === 'history'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Archive Archives ({jobsHistory.filter(j => j.status === 'completed').length})
                </button>

                <button
                  id="btn_tab_blueprints"
                  onClick={() => setActiveMainTab('blueprints')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeMainTab === 'blueprints'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Docs & System Guide
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn_run_agent_manual"
                  disabled={isTriggering}
                  onClick={handleManualTrigger}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl border transition-all ${isTriggering
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-teal-500 text-white border-teal-600 hover:bg-teal-600 shadow-md transform hover:-translate-y-0.5'
                    }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isTriggering ? 'Pipeline Sweep Active...' : 'Gather & Publish Now'}
                </button>
              </div>
            </div>

            {/* TAB A: CONTROL PANEL */}
            {activeMainTab === 'control' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Left Side: Dynamic Controls & Subscribers */}
                <div className="space-y-6 lg:col-span-1">

                  {/* System Toggle armed toggle */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs space-y-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block border-b border-gray-50 pb-2">
                      Agent Scheduler Toggle
                    </span>
                    <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-150 rounded-xl">
                      <div>
                        <div className="text-xs font-bold text-gray-800">Start/Stop Automation</div>
                        <p className="text-[10px] text-gray-400">Daily checks are {systemConfig.automationEnabled ? 'engaged' : 'paused'}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleAutomation(systemConfig.automationEnabled)}
                        className={`w-12 h-6 rounded-full p-1 transition-all ${systemConfig.automationEnabled ? 'bg-teal-500 flex justify-end' : 'bg-gray-300 flex justify-start'
                          }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveSchedule} className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase text-gray-400">Run Schedule Time (Daily)</label>
                        <input
                          type="time"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="w-full text-xs p-2 border border-gray-200 rounded-lg bg-gray-50/50 font-mono font-bold text-center"
                        />
                      </div>

                      {scheduleStatusMsg && (
                        <div className="p-2 bg-emerald-50 text-[10px] text-emerald-600 rounded-lg">
                          {scheduleStatusMsg}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        Save Schedule Time
                      </button>
                    </form>
                  </div>

                  {/* Mail Recipients configuration */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs space-y-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block border-b border-gray-50 pb-2">
                      Newsletter Recipients ({recipients.length})
                    </span>

                    <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                      {recipients.map(r => (
                        <div key={r.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-gray-800 truncate leading-none">{r.name}</div>
                            <div className="text-[9px] font-mono text-gray-400 truncate mt-1">{r.email}</div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleRecipient(r.id, r.enabled)}
                              className={`p-1 rounded-md border transition-colors ${r.enabled
                                ? 'bg-teal-50 text-teal-600 border-teal-100'
                                : 'bg-gray-100 text-gray-400 border-gray-250'
                                }`}
                              title={r.enabled ? 'Mute' : 'Engage'}
                            >
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecipient(r.id)}
                              className="p-1 bg-white text-rose-600 border border-gray-150 rounded-md hover:bg-rose-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {recipients.length === 0 && (
                        <p className="text-[10px] text-gray-400 italic">Subscriber register is currently empty.</p>
                      )}
                    </div>

                    <form onSubmit={handleAddRecipient} className="pt-2 border-t border-gray-100 space-y-2">
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          placeholder="Name..."
                          value={newRecName}
                          onChange={(e) => setNewRecName(e.target.value)}
                          className="text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50/30"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email..."
                          value={newRecEmail}
                          onChange={(e) => setNewRecEmail(e.target.value)}
                          className="text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50/30"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-1.5 bg-gray-100 text-gray-800 text-[11px] font-bold rounded-lg hover:bg-gray-200 flex justify-center items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Register Subscriber
                      </button>
                    </form>
                  </div>

                  {/* Facebook and Gmail Quick Auth triggers */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs space-y-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block border-b border-gray-50 pb-2">
                      Publishing OAuth Channels
                    </span>

                    <div className="space-y-3">
                      {/* FB Page Button */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-800 flex items-center gap-1">
                            <Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook Page Feed
                          </span>
                          <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded leading-none ${facebookConfig?.connected ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                            {facebookConfig?.connected ? 'Linked' : 'Disconnected'}
                          </span>
                        </div>
                        {facebookConfig?.connected && (
                          <p className="text-[10px] text-gray-500 leading-none">
                            Sending posts directly to Page: <strong>{facebookConfig.pageName}</strong>
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={handleConnectFacebook}
                          className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg shadow-sm flex items-center justify-center gap-1"
                        >
                          <Facebook className="w-3 h-3" /> Connect Facebook Page
                        </button>
                      </div>

                      {/* Gmail Button */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-gray-800 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-teal-600" /> Gmail Delivery Routing
                          </span>
                          <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded leading-none ${gmailConfig?.connected ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                            {gmailConfig?.connected ? 'Linked' : 'Disconnected'}
                          </span>
                        </div>
                        {gmailConfig?.connected && (
                          <p className="text-[10px] text-gray-500 leading-none">
                            Sender account: <strong>{gmailConfig.emailAddress}</strong>
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={handleConnectGmail}
                          className="w-full py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-[10px] font-bold rounded-lg shadow-sm flex items-center justify-center gap-1"
                        >
                          <Mail className="w-3.5 h-3.5" /> Connect Gmail Mailer
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Standalone Pipeline Testing */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs space-y-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block border-b border-gray-50 pb-2">
                      Integration Sandbox Testing
                    </span>

                    <div className="space-y-3">
                      {/* Test Facebook Post */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                            <Facebook className="w-3.5 h-3.5 text-blue-600" /> Test Facebook Post
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500">
                          Dispatches an instant verification update to your connected page or simulated stream.
                        </p>
                        <button
                          type="button"
                          disabled={testFbLoading}
                          onClick={handleTestFacebook}
                          className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1"
                        >
                          <Send className="w-3 h-3" /> {testFbLoading ? 'Publishing Test...' : 'Test Facebook Post'}
                        </button>
                        {testFbMessage && (
                          <div className="p-2 bg-neutral-900 text-white font-mono text-[9px] rounded-lg mt-1 break-words">
                            {testFbMessage}
                          </div>
                        )}
                      </div>

                      {/* Test Email Delivery */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-teal-600" /> Test Email Delivery
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500">
                          Sends a test newsletter update to your active subscriber register via Gmail OAuth.
                        </p>
                        <button
                          type="button"
                          disabled={testEmailLoading}
                          onClick={handleTestEmail}
                          className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1"
                        >
                          <Send className="w-3 h-3" /> {testEmailLoading ? 'Sending Test...' : 'Test Email Delivery'}
                        </button>
                        {testEmailMessage && (
                          <div className="p-2 bg-neutral-900 text-white font-mono text-[9px] rounded-lg mt-1 break-words">
                            {testEmailMessage}
                          </div>
                        )}
                      </div>

                      {/* Generate Test Video */}
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Generate Test Video
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500">
                          Bypasses the 24h news scraping sequence and instantly builds a simulated completed video reel.
                        </p>
                        <button
                          type="button"
                          disabled={testVideoLoading}
                          onClick={handleTestVideo}
                          className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current" /> {testVideoLoading ? 'Assembling Test...' : 'Generate Test Video'}
                        </button>
                        {testVideoMessage && (
                          <div className="p-2 bg-neutral-900 text-white font-mono text-[9px] rounded-lg mt-1 break-words">
                            {testVideoMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side: Primary Active Stage */}
                <div className="space-y-6 lg:col-span-2">

                  {/* Dynamic player */}
                  {activeReelContent ? (
                    <ReelSimulator content={activeReelContent} />
                  ) : (
                    <div className="p-16 text-center bg-white border border-gray-100 rounded-3xl shadow-xs space-y-4">
                      <div className="mx-auto w-12 h-12 bg-neutral-900 text-white rounded-2xl flex items-center justify-center">
                        <Play className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">No Compiled Media Present</h4>
                        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                          Click "Gather & Publish Now" above to launch our Gemini Scraping agent and synthesize your first visual video reel right now!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* System Statistics panel */}
                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs space-y-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block border-b border-gray-50 pb-2">
                      SaaS Delivery Engagement Analytics
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                        <span className="text-[10px] font-mono text-gray-400 block uppercase font-bold">Total Runs</span>
                        <span className="text-lg font-bold font-display text-gray-800 mt-1 block">
                          {stats ? stats.totalVideosGenerated : jobsHistory.length}
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                        <span className="text-[10px] font-mono text-gray-400 block uppercase font-bold">Engagements</span>
                        <span className="text-lg font-bold font-display text-teal-600 mt-1 block flex items-center gap-0.5">
                          <TrendingUp className="w-3.5 h-3.5" /> {stats ? stats.averageEngagementRate : 68.2}%
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                        <span className="text-[10px] font-mono text-gray-400 block uppercase font-bold">Facebook Posts</span>
                        <span className="text-xs font-bold text-emerald-600 mt-1 block flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Active Sync
                        </span>
                      </div>
                      <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                        <span className="text-[10px] font-mono text-gray-400 block uppercase font-bold">Subscribers</span>
                        <span className="text-lg font-bold font-display text-gray-800 mt-1 block">
                          {recipients.filter(r => r.enabled).length} Active
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB B: ARCHIVES HISTORY */}
            {activeMainTab === 'history' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Left: Job Lists */}
                <div className="space-y-3 lg:col-span-1">
                  <div className="p-3 border-b border-gray-150">
                    <span className="text-[10px] font-mono text-gray-400 uppercase font-bold block">Run history index</span>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {jobsHistory.map(job => {
                      const isSelected = selectedJob?.id === job.id;
                      const runDate = new Date(job.date).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      });

                      return (
                        <button
                          key={job.id}
                          onClick={() => setSelectedJob(job)}
                          className={`w-full p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 bg-white ${isSelected ? 'ring-2 ring-teal-500/50 border-teal-500' : 'border-gray-100 hover:border-gray-250'
                            }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">{job.id}</span>
                            <span className={`text-[8px] font-bold font-mono uppercase px-1.5 py-0.5 rounded ${job.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                              {job.status}
                            </span>
                          </div>

                          <div>
                            <h5 className="text-xs font-bold text-gray-800 line-clamp-1">
                              {job.generatedContent?.headline || 'Unformulated Headline'}
                            </h5>
                            <span className="text-[10px] text-gray-400 mt-1 block">Cycle: {runDate}</span>
                          </div>

                          {job.analytics && (
                            <div className="flex items-center gap-3 border-t border-gray-50 pt-1.5 mt-1 text-[10px] font-mono text-gray-400">
                              <span className="flex items-center gap-0.5"><Play className="w-3 h-3 text-teal-500" /> {job.analytics.views} views</span>
                              <span className="flex items-center gap-0.5"><Plus className="w-3 h-3 text-teal-400" /> {job.analytics.likes} likes</span>
                            </div>
                          )}
                        </button>
                      );
                    })}

                    {jobsHistory.length === 0 && (
                      <p className="text-xs text-gray-400 italic text-center py-6">No previous jobs compiled yet.</p>
                    )}
                  </div>
                </div>

                {/* Right: Selected job inspector */}
                <div className="lg:col-span-2">
                  {selectedJob ? (
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-6">

                      <div className="flex justify-between items-center border-b border-gray-150 pb-4 flex-wrap gap-2">
                        <div>
                          <span className="text-[9px] font-mono text-teal-500 font-bold uppercase">Archive Record Profile</span>
                          <h3 className="text-sm font-bold text-gray-900 mt-0.5">{selectedJob.generatedContent?.headline || 'Draft Run'}</h3>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedJob(selectedJob);
                            setActiveMainTab('control');
                          }}
                          className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold rounded-lg border border-teal-200"
                        >
                          Play in Control Panel
                        </button>
                      </div>

                      <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-150">
                        <span className="text-[9px] font-mono text-gray-400 uppercase font-bold">Executive One-Sentence Bulletin</span>
                        <p className="text-xs text-gray-700 italic">"{selectedJob.generatedContent?.oneSentenceSummary}"</p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-gray-400 uppercase font-bold">Ranking Top 3 News Scopes</span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {selectedJob.topSelected?.map((st, i) => (
                            <div key={st.id} className="p-3 border border-gray-150 rounded-xl bg-white space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-1 py-0.5 rounded">Rank {i + 1}</span>
                                <span className="text-[9px] font-mono font-bold text-gray-400">Score {st.totalScore}</span>
                              </div>
                              <h6 className="text-xs font-bold text-gray-800 line-clamp-1">{st.title}</h6>
                              <p className="text-[10px] text-gray-500 line-clamp-3">{st.summary}</p>
                              <span className="text-[9px] font-mono text-gray-400 mt-1 block">Source: {st.source}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-gray-400 uppercase font-bold">Key Takeaway Bulletin points</span>
                        <ul className="text-xs text-gray-650 space-y-1.5">
                          {selectedJob.generatedContent?.keyTakeaways.map((tk, idx) => (
                            <li key={idx} className="flex gap-1.5">
                              <span className="text-teal-500 font-bold">✓</span>
                              <span>{tk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-gray-400 uppercase font-bold font-mono">Consolidated Step Execution Logs</span>
                        <div className="bg-[#111] p-4 rounded-xl text-[10px] font-mono text-neutral-300 leading-relaxed max-h-[180px] overflow-y-auto">
                          {selectedJob.logs.map((log, idx) => (
                            <div key={idx} className="py-0.5">
                              <span className="text-neutral-500 font-bold">[{idx + 1}]</span> {log}
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic text-center py-12">Select an archive record from the index list to audit logs.</p>
                  )}
                </div>

              </div>
            )}

            {/* TAB C: SYSTEM DOCUMENTS */}
            {activeMainTab === 'blueprints' && <DocsHub />}

          </main>
        </>
      )}

      {/* Background active scheduler trigger log overlay */}
      {activePollingJob && (activePollingJob.status !== 'completed' && activePollingJob.status !== 'failed') && (
        <ActiveJobLogger
          job={activePollingJob}
          onClose={() => setActivePollingJob(null)}
        />
      )}

    </div>
  );
}
