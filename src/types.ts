/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NewsStory {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  noveltyScore: number;
  industryImpact: number;
  citations: number;
  engagement: number;
  totalScore: number;
}

export interface VideoSlide {
  id: string;
  title: string;
  subtitle: string;
  text: string;
  imageKeyword: string;
  imageFallbackUrl: string;
}

export interface GeneratedScript {
  headline: string;
  oneSentenceSummary: string;
  keyTakeaways: string[];
  scriptText: string;
  voiceVoice: string; // TTS voice identifier
  slides: VideoSlide[];
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
  enabled: boolean;
  addedAt: string;
}

export interface FacebookConfig {
  pageName: string;
  pageId: string;
  accessToken: string;
  connected: boolean;
  status: 'active' | 'expired' | 'unconfigured';
}

export interface GmailConfig {
  emailAddress: string;
  connected: boolean;
  refreshToken: string;
  status: 'active' | 'expired' | 'unconfigured';
}

export interface SystemConfig {
  setupWizardCompleted: boolean;
  geminiApiKey: string;
  openaiApiKey: string;
  emailSenderAddress: string;
  autoRetryCount: number;
  sendErrorAlerts: boolean;
  automationEnabled: boolean;
}

export interface ScheduleConfig {
  cron: string;
  time: string; // e.g. "07:00"
  enabled: boolean;
  timezone: string;
  lastRunAt?: string;
  nextRunAt?: string;
}

export interface VideoJob {
  id: string;
  date: string;
  status: 'pending' | 'collecting' | 'ranking' | 'generating_voice'| 'rendering' | 'distributing' | 'completed' | 'failed';
  progress: number; // 0 to 100
  logs: string[];
  newsCollected?: NewsStory[];
  topSelected?: NewsStory[];
  generatedContent?: GeneratedScript;
  thumbnailUrl?: string;
  videoUrl?: string; // local simulation playback link
  emailDistributed?: boolean;
  fbPublished?: boolean;
  analytics?: {
    views: number;
    completionRate: number; // percentage
    shares: number;
    likes: number;
    clicks: number;
  };
}

export interface DashboardStats {
  totalVideosGenerated: number;
  totalEmailsSent: number;
  totalFacebookPublishes: number;
  totalAudienceReached: number;
  averageEngagementRate: number;
  viewsTrend: { date: string; count: number }[];
  newsSourceBreakdown: { source: string; count: number }[];
}
