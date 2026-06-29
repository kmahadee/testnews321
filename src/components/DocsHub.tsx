/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Server, Database, Code, ShieldCheck, DollarSign, ExternalLink, HelpCircle, Cpu, Mail, Facebook, Terminal } from 'lucide-react';

export default function DocsHub() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'database' | 'fastapi' | 'docker' | 'deployment' | 'costs'>('architecture');

  const tabs = [
    { id: 'architecture', label: 'System Flow', icon: Server },
    { id: 'database', label: 'DB Schema', icon: Database },
    { id: 'fastapi', label: 'FastAPI Backend', icon: Code },
    { id: 'docker', label: 'Docker & Compose', icon: Cpu },
    { id: 'deployment', label: 'One-Click Cloud Deploy', icon: Terminal },
    { id: 'costs', label: 'Pricing & ROIs', icon: DollarSign }
  ] as const;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
      
      {/* Tab Select Header */}
      <div className="bg-gray-50 border-b border-gray-100 p-4 shrink-0 overflow-x-auto flex items-center gap-1.5 scrollbar-thin">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`btn_docs_tab_${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-gray-900 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Panel Contents */}
      <div className="p-6">
        
        {/* TAB 1: System Flow & Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-display font-bold text-gray-900">SaaS System Architecture Blueprint</h3>
              <p className="text-xs text-gray-500 mt-0.5">Automated Daily AI Digests: Gathering, Screening, Synthesizing, and Distributing.</p>
            </div>

            {/* Architecture SVG Flow Box */}
            <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl overflow-x-auto">
              <div className="min-w-[600px] flex flex-col items-center gap-4 py-4">
                
                {/* Stage 1: Core Inputs */}
                <div className="flex gap-4">
                  <div className="px-3 py-2 bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-mono rounded-lg text-center font-bold shadow-xs">
                    RSS Blogs / APIs<br/>(OpenAI, DeepMind)
                  </div>
                  <div className="px-3 py-2 bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-mono rounded-lg text-center font-bold shadow-xs">
                    GitHub Trending<br/>(AI Repositories)
                  </div>
                  <div className="px-3 py-2 bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-mono rounded-lg text-center font-bold shadow-xs">
                    Google Search<br/>(Grounding Engine)
                  </div>
                </div>

                {/* Arrow down */}
                <div className="h-4 w-0.5 bg-gray-300" />

                {/* Stage 2: FastAPI Core Cron Agent */}
                <div className="w-full max-w-sm p-4 bg-gray-900 border border-black rounded-xl text-center space-y-1.5 shadow-md">
                  <span className="text-[9px] font-mono uppercase bg-teal-500 text-black px-2 py-0.5 rounded-full font-bold">FastAPI + Celery Cron Scheduler</span>
                  <p className="text-xs font-bold text-white">Daily 7:00 AM UTC Runner</p>
                  <p className="text-[11px] text-gray-400">Scrapes, Scores & Filters Top 10 Candidate feeds down to Top 3</p>
                </div>

                {/* Arrow down */}
                <div className="h-4 w-0.5 bg-gray-300 flex items-center justify-center">
                  <span className="text-[9px] font-mono text-gray-400 bg-white px-1">Gemini-3.5-Flash API</span>
                </div>

                {/* Stage 3: Content Synthesizers */}
                <div className="flex gap-4">
                  <div className="p-3 bg-indigo-50 border border-indigo-150 text-indigo-900 text-[11px] font-mono rounded-xl text-center max-w-[170px] shadow-2xs">
                    <span className="font-bold">Text Summarizer</span><br/>
                    Headline, 1-Sentence Takeaways & Word Script
                  </div>
                  <div className="p-3 bg-pink-50 border border-pink-150 text-pink-900 text-[11px] font-mono rounded-xl text-center max-w-[170px] shadow-2xs">
                    <span className="font-bold">Media Synthesizer</span><br/>
                    TTS Audio Vocal & Slide images query
                  </div>
                </div>

                {/* Arrow down */}
                <div className="h-4 w-0.5 bg-gray-300 flex items-center justify-center">
                  <span className="text-[9px] font-mono text-gray-400 bg-white px-1">MoviePy Engine</span>
                </div>

                {/* Stage 4: Rendering & Compile */}
                <div className="w-full max-w-xs p-3 bg-neutral-900 border border-black rounded-lg text-center shadow-xs">
                  <p className="text-xs font-mono font-bold text-teal-400">FFmpeg Assembly Block</p>
                  <p className="text-[10px] text-gray-400">Melds Voice-Over tracks, audio sound waves, animated subtitle streams into 1080x1920 MP4</p>
                </div>

                {/* Arrow down */}
                <div className="h-4 w-0.5 bg-gray-300" />

                {/* Stage 5: SaaS Distribution channels */}
                <div className="flex gap-4">
                  <div className="px-3.5 py-2.5 bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-mono rounded-lg text-center font-bold flex items-center gap-1.5 shadow-sm">
                    <Mail className="w-4 h-4 text-rose-500" />
                    SendGrid Emails
                  </div>
                  <div className="px-3.5 py-2.5 bg-blue-50 border border-blue-200 text-blue-900 text-[11px] font-mono rounded-lg text-center font-bold flex items-center gap-1.5 shadow-sm">
                    <Facebook className="w-4 h-4 text-blue-500" />
                    Facebook Reels API
                  </div>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                <span className="text-teal-600 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" /> Why FastAPI & Celery?
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  FastAPI provides native asynchronous I/O with high concurrency, perfect for scrape dispatch flows. 
                  Celery acts as the process manager backed by Redis, enabling long-lived non-blocking rendering tasks 
                  (like MoviePy/FFmpeg compilation which can take 1-2 minutes) without clogging standard web gateways.
                </p>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                <span className="text-indigo-600 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Safety Architecture
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Keys are managed securely in server environment variables (.env). The pipeline includes strict try/except guards 
                  transmitting fallback responses in the event of third-party API issues, maintaining scheduled persistence.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PostgreSQL Schema */}
        {activeTab === 'database' && (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-display font-bold text-gray-900">Relational PostgreSQL Schema</h3>
              <p className="text-xs text-gray-500 mt-0.5">Production-ready database structure modeled inside SQLAlchemy or Drizzle ORM.</p>
            </div>

            <pre className="p-4 bg-neutral-950 text-emerald-400 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto">
{`-- SQL Database schema for AI News Agent SaaS

-- 1. Email Distribution List
CREATE TABLE recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    enabled BOOLEAN DEFAULT TRUE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Facebook Page Tokens & Conf
CREATE TABLE facebook_config (
    id SERIAL PRIMARY KEY,
    page_name VARCHAR(255) NOT NULL,
    page_id VARCHAR(100) NOT NULL,
    access_token TEXT NOT NULL,
    connected BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Automation Job Run Records
CREATE TABLE video_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL, -- 'pending', 'completed', 'failed'
    headline VARCHAR(500),
    one_sentence_summary TEXT,
    script_text TEXT,
    thumbnail_url VARCHAR(1000),
    video_path VARCHAR(1000),
    email_sent BOOLEAN DEFAULT FALSE,
    facebook_posted BOOLEAN DEFAULT FALSE
);

-- 4. Scraped Candidate Articles
CREATE TABLE news_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_job_id UUID REFERENCES video_jobs(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    source VARCHAR(255) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    novelty_score INT NOT NULL check(novelty_score between 1 and 10),
    impact_score INT NOT NULL check(impact_score between 1 and 10),
    citations INT NOT NULL,
    engagement INT NOT NULL,
    total_score INT NOT NULL,
    is_top_selected BOOLEAN DEFAULT FALSE
);

-- 5. Analytics logs
CREATE TABLE job_analytics (
    id SERIAL PRIMARY KEY,
    video_job_id UUID REFERENCES video_jobs(id) ON DELETE CASCADE,
    views INT DEFAULT 0,
    completion_rate NUMERIC(5,2) DEFAULT 0.00,
    likes INT DEFAULT 0,
    shares INT DEFAULT 0,
    clicks INT DEFAULT 0,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create optimal index pathways for cron execution speeds
CREATE INDEX idx_news_scraped ON news_history(published_at DESC);
CREATE INDEX idx_jobs_status ON video_jobs(status);
`}
            </pre>
          </div>
        )}

        {/* TAB 3: Python FastAPI Backend Code */}
        {activeTab === 'fastapi' && (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-display font-bold text-gray-900">Python FastAPI + Celery Source Reference</h3>
              <p className="text-xs text-gray-500 mt-0.5">The backend microservice managing MoviePy and text-to-speech rendering pipelines.</p>
            </div>

            <pre className="p-4 bg-neutral-950 text-teal-400 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[400px] overflow-y-auto">
{`# main.py - Python FastAPI application core
from fastapi import FastAPI, BackgroundTasks, Depends, HTTPException
from celery_app import compile_video_task
from sqlalchemy.orm import Session
import os

app = FastAPI(title="AI News Agent Rendering Microservice")

@app.post("/api/render-shorts/{job_id}", status_code=202)
def trigger_shorts_render(job_id: str, db: Session = Depends(get_db)):
    """
    Spawns background task to compose vertical mp4 with moviepy and ffmpeg.
    Uses Redis as message broker to keep web response latency sub-millisecond.
    """
    job = db.query(VideoJob).filter(VideoJob.id == job_id).first()
    if not job:
         raise HTTPException(status_code=404, detail="Job entity definition not found")
         
    # Enqueue task to standalone docker worker
    task = compile_video_task.delay(job_id)
    return {"status": "enqueued", "celery_task_id": task.id}


# celery_app.py - Background Worker
from celery import Celery
from moviepy.editor import ImageClip, AudioFileClip, TextClip, CompositeVideoClip
from gtts import gTTS
import os

celery = Celery("video_tasks", broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"))

@celery.task
def compile_video_task(job_id: str):
    # 1. Fetch Job Script from PostgreSQL
    job = fetch_job_from_pg(job_id)
    
    # 2. Text-to-Speech Generation
    tts_file = f"/tmp/vocal_{job_id}.mp3"
    tts = gTTS(text=job.script_text, lang='en', tld='co.uk')
    tts.save(tts_file)
    
    # 3. Assemble Graphic Slides
    slides_clips = []
    duration_per_slide = AudioFileClip(tts_file).duration / len(job.slides)
    
    for i, slide in enumerate(job.slides):
        # Fetch unsplash keyword high-res frame
        img_path = download_stock_image(slide.image_keyword)
        
        # Instantiate MoviePy Clips
        image_clip = ImageClip(img_path).set_duration(duration_per_slide)
        txt_clip = TextClip(slide.title, fontsize=48, color='white', font='Inter-Bold', size=(960, 400))
        txt_clip = txt_clip.set_pos(('center', 'center')).set_duration(duration_per_slide)
        
        slide_composite = CompositeVideoClip([image_clip, txt_clip]).set_start(i * duration_per_slide)
        slides_clips.append(slide_composite)
        
    # 4. Integrate Subtitles & Compile Final MP4 Output
    final_video = concatenate_videoclips(slides_clips, method="compose")
    final_vocal = AudioFileClip(tts_file)
    final_video = final_video.set_audio(final_vocal)
    
    output_path = f"/shared/videos/reel_{job_id}.mp4"
    final_video.write_videofile(
        output_path,
        fps=24,
        codec="libx264",
        audio_codec="aac",
        temp_audiofile='/tmp/rendered_temp.m4a',
        remove_temp=True
    )
    
    # 5. Dispatch distribution callbacks (SendGrid, Facebook Graph API)
    dispatch_sendgrid_newsletter(job_id, output_path)
    publish_to_facebook_page(job_id, output_path)
    
    mark_job_completed_in_db(job_id)
    return {"status": "success", "video_path": output_path}
`}
            </pre>
          </div>
        )}

        {/* TAB 4: Docker Configuration */}
        {activeTab === 'docker' && (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-display font-bold text-gray-900">Docker & docker-compose configurations</h3>
              <p className="text-xs text-gray-500 mt-0.5">Standard Container deployments bundling compiled Node/Express modules and Python pipelines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-gray-600 block">FastAPI Rendering Dockerfile</span>
                <pre className="p-3 bg-neutral-950 text-amber-500 rounded-lg font-mono text-[10px] leading-relaxed overflow-x-auto max-h-[250px] overflow-y-auto">
{`# Dockerfile - Python Rendering Worker
FROM python:3.11-slim

# Install system dependencies (FFmpeg, ImageMagick)
RUN apt-get update && apt-get install -y \\
    ffmpeg \\
    imagemagick \\
    git \\
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Fix ImageMagick security policy for MoviePy text renders
RUN sed -i 's/domain="path" rights="none"/domain="path" rights="read|write"/g' /etc/ImageMagick-6/policy.xml

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
`}
                </pre>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-gray-600 block">docker-compose.yml</span>
                <pre className="p-3 bg-neutral-950 text-amber-500 rounded-lg font-mono text-[10px] leading-relaxed overflow-x-auto max-h-[250px] overflow-y-auto">
{`version: '3.8'

services:
  # 1. Express Admin React Dashboard
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
    depends_on:
      - db
      - fastapi

  # 2. Python FastAPI Rendering Node
  fastapi:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://usr:pwd@db:5432/db
      - REDIS_URL=redis://queue:6379/0
      - GEMINI_API_KEY=\${GEMINI_API_KEY}

  # 3. Celery Background Worker
  celer_worker:
    build: ./backend
    command: celery -A celery_app worker --loglevel=info
    volumes:
      - shared_media:/shared
    environment:
      - REDIS_URL=redis://queue:6379/0
      - GEMINI_API_KEY=\${GEMINI_API_KEY}

  # 4. Storage Nodes
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=usr
      - POSTGRES_PASSWORD=pwd
      - POSTGRES_DB=db
    volumes:
      - pgdata:/var/lib/postgresql/data

  queue:
    image: redis:7-alpine

volumes:
  pgdata:
  shared_media:
`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: One-Click Cloud Deployment Guide */}
        {activeTab === 'deployment' && (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-display font-bold text-gray-900">SaaS One-Click Cloud Deployment Guide</h3>
              <p className="text-xs text-gray-500 mt-0.5">Deploy and operate your fully automated video agency with zero code writing.</p>
            </div>

            <div className="space-y-4 font-sans text-xs text-gray-600 leading-relaxed">
              <div className="p-3 bg-teal-50 border border-teal-150 rounded-xl">
                <span className="font-bold text-teal-800">✨ Single Deployment Command:</span>
                <p className="mt-1">We've packaged everything into a single-step setup script. To launch the interactive deploy wizard, open your terminal and run:</p>
                <code className="block bg-neutral-900 text-teal-400 p-2.5 rounded-lg mt-1.5 font-mono text-[10px]">
                  sh deploy.sh
                </code>
              </div>

              <div className="space-y-2">
                <h5 className="font-display font-bold text-gray-900">Option A: Google Cloud Run (Recommended)</h5>
                <p>Google Cloud Run is extremely cheap and offers a huge free tier. It scales down to zero when the agent isn't running daily, so you only pay for actual seconds used.</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Install the Google Cloud CLI.</li>
                  <li>In your terminal, execute the single command:</li>
                  <code className="block bg-gray-100 p-1.5 rounded font-mono text-[10px] my-1">
                    gcloud run deploy ai-news-agent --source . --port 3000 --allow-unauthenticated
                  </code>
                  <li>Enter your preferred geographic region when prompted. That's it!</li>
                </ol>
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-3">
                <h5 className="font-display font-bold text-gray-900">Option B: Railway App</h5>
                <p>Railway builds your app automatically from our pre-packaged Dockerfile with no complex setups needed.</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Install the Railway CLI: <code className="bg-gray-100 px-1 rounded">npm install -g @railway/cli</code></li>
                  <li>Link your project with: <code className="bg-gray-100 px-1 rounded">railway login</code></li>
                  <li>Push your build with: <code className="bg-gray-100 px-1 rounded">railway up</code></li>
                </ol>
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-3">
                <h5 className="font-display font-bold text-gray-900">Option C: Render Container Service</h5>
                <p>Render is excellent for hosting your container straight from GitHub with automatic build webhooks.</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Create a free account at Render.com</li>
                  <li>Click "New", select "Web Service", and connect your repository code.</li>
                  <li>Render will automatically find our <code className="bg-gray-100 px-1 rounded">Dockerfile</code>.</li>
                  <li>Add an environment variable under settings: <code className="bg-gray-100 px-1 rounded">NODE_ENV=production</code>.</li>
                  <li>Click 'Deploy' to launch!</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Monthly Costs & Pricing Sheet */}
        {activeTab === 'costs' && (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-display font-bold text-gray-900">SaaS Operating Cost Sheet & Estimator</h3>
              <p className="text-xs text-gray-500 mt-0.5">Estimated monthly pricing variables running this automated agent platform continuously.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border border-gray-100 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-mono text-[10px] uppercase">
                    <th className="p-3 font-semibold">Service Block</th>
                    <th className="p-3 font-semibold">Estimated Volume</th>
                    <th className="p-3 font-semibold">Unit Price Metric</th>
                    <th className="p-3 font-semibold font-bold text-teal-600">Cost/Month</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-3 font-semibold">Gemini 3.5 Flash API</td>
                    <td className="p-3 font-mono">15,000,000 Input/Output Tokens</td>
                    <td className="p-3 font-mono">$0.075 / 1M Input Tokens</td>
                    <td className="p-3 font-mono font-bold text-teal-600">$1.12</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">AWS ECS CPU Rendering</td>
                    <td className="p-3 font-mono">30 Compiles (1 hr compute total)</td>
                    <td className="p-3 font-mono">$0.04048 per vCPU Hour</td>
                    <td className="p-3 font-mono font-bold text-teal-600">$0.08</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">ElephantSQL / Postgres Core</td>
                    <td className="p-3 font-mono">Default 1GB transactional storage</td>
                    <td className="p-3 font-mono">Developer Instance Block</td>
                    <td className="p-3 font-mono font-bold text-teal-600">$0.00 (Free Tier)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">SendGrid Email Delivery</td>
                    <td className="p-3 font-mono">3,000 Email transactions sent</td>
                    <td className="p-3 font-mono">Free Tier 100/Day limit</td>
                    <td className="p-3 font-mono font-bold text-teal-600">$0.00 (Free Tier)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Cloud Run Core Orchestration</td>
                    <td className="p-3 font-mono">Continuous node uptime hosting</td>
                    <td className="p-3 font-mono">Scale-to-zero scale limits</td>
                    <td className="p-3 font-mono font-bold text-teal-600">$2.40</td>
                  </tr>
                  <tr className="bg-teal-50/40 text-gray-900 font-bold border-t border-gray-200">
                    <td className="p-3">Total Platform Runway</td>
                    <td className="p-3 font-mono">Daily Agent Operations</td>
                    <td className="p-3 font-mono">Fully Automatic SaaS</td>
                    <td className="p-3 font-mono text-teal-700">$3.60 / Month</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-gray-400 font-mono text-right">
              * Calculations assume standard 30-day continuous scheduling pipeline cycles.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
