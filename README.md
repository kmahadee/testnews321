# 🎬 AI News Agent SaaS Application (Production Upgrade)

An automated AI-powered video compilation, newsletter distribution, and social publishing agency designed for zero-code non-technical operators. The system crawls the web for trending AI news, evaluates and ranks stories, generates narrative scripts, compiles simulated vertical reels, drafts newsletters, and dispatches them straight to your Facebook Page and Gmail subscriber list every single day.

---

## 🚀 Key Production Capabilities
* **Automatic News Scraping**: Searches real-time sources (OpenAI, DeepMind, Anthropic, TechCrunch, etc.) via Gemini 3.5 Search Grounding.
* **Intelligent News Ranking**: Scores articles based on significance, novelty, citations, and engagement signals.
* **Vertical Reel Simulator**: Generates engaging captions, visual cues, stock keywords, and high-quality voiceover audio structures.
* **Gmail OAuth Sender Integration**: Dispatches video summaries and download bulletins directly through your connected Google Workspace account.
* **Facebook Page Publisher**: Shares updates, engaging descriptions, and social tags directly to your connected business Page feed.
* **Automatic Daily Automation**: Background scheduler checks and triggers execution automatically at your specified daily UTC time.
* **Developer Integration Sandbox**: Real-time mock generator, Facebook posting test, and Gmail dispatcher for seamless verification.

---

## ☁️ One-Click Deployment Guide

This app is containerized using Docker and is ready to deploy on any major modern cloud infrastructure with a single action.

### Option 1: Google Cloud Run (Recommended)
Google Cloud Run is highly recommended due to its **Scale-to-Zero Free Tier**, meaning you pay $0 when the agent is idle.
1. Download and install the [Google Cloud SDK](https://cloud.google.com/sdk).
2. Authenticate and deploy directly from your project directory:
   ```bash
   gcloud run deploy ai-news-agent --source . --port 3000 --allow-unauthenticated
   ```
3. That's it! Cloud Run will build the Docker image, upload it to Artifact Registry, and provision a live HTTPS endpoint.

### Option 2: Railway Deployment
1. Install the Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```
2. Link your project and start deployment:
   ```bash
   railway login
   railway up
   ```
3. Railway will read `railway.json` and deploy our pre-bundled Docker service.

### Option 3: Render Deployment
1. Register a free account on [Render](https://render.com).
2. Click **New** ➔ **Web Service** in the top right.
3. Link your GitHub repository.
4. Render automatically detects the `Dockerfile`. Ensure the `NODE_ENV` environment variable is set to `production`.
5. Click **Deploy Web Service**.

---

## 🔌 One-Click Connection Wizard (OAuth)

When launching the application for the first time, you will be greeted with our Setup Wizard guiding you through secure credentials configuration.

### 👥 Connecting Facebook Business Page
1. Ensure you are an administrator of the Facebook Business Page you wish to publish to.
2. Under **OAuth Channels**, click **Connect Facebook Page**.
3. Log in with your Facebook account and grant the requested permissions (`pages_manage_posts`, `pages_read_engagement`).
4. Select the target Business Page.
5. The system will automatically acquire a secure **Long-Lived Page Access Token** which handles background publishes.

### 📬 Connecting Gmail Delivery Routing
1. On the control panel or wizard, click **Connect Gmail Mailer**.
2. Sign in with the Google Account you wish to use as the newsletter sender.
3. Accept the permissions to allow the app to securely dispatch emails (`gmail.send`).
4. The system automatically fetches your secure offline refresh tokens and populates the subscriber dispatch router. No SMTP details are ever exposed.

---

## 🗓️ Configuring Daily Automation

Daily automation runs fully in the background inside the container:
1. Log in to the Admin Dashboard (bypass key: `admin`).
2. Set your preferred **Run Schedule Time** (e.g., `07:00` UTC).
3. Toggle **Start/Stop Automation** to **Engaged (Enabled)**.
4. The background scheduler checks current time intervals every 30 seconds. When UTC time matches your schedule, the full execution pipeline triggers:
   $$\text{News Collection} \rightarrow \text{Story Ranking} \rightarrow \text{Content Formulating} \rightarrow \text{Gmail Dispatch} \rightarrow \text{Facebook Publish}$$

---

## 🛠️ Sandbox Developer Verification & Tests

To ensure complete confidence before initiating live pipelines, we have mounted an **Integration Sandbox Testing** deck inside the Dashboard:
* **Test Facebook Post**: Sends a verification greeting with live timestamps to your connected business Page feed.
* **Test Email Delivery**: Transmits a standalone test newsletter block to your registered subscriber list.
* **Generate Test Video**: Skips the Gemini web scraping step and instantly compiles a pre-formulated simulated video reel complete with multi-slide subtitles and stock Unsplash backdrops. Excellent for verifying component layouts in seconds!

---

## 📦 Local Container Execution
To build and run the application locally on your computer with Docker:
1. Clone your project code.
2. Initialize environment variables:
   ```bash
   cp .env.example .env
   ```
3. Start the stack:
   ```bash
   docker compose up --build
   ```
4. Access the dashboard at `http://localhost:3000`. Your configurations and database logs are stored in `server_db.json`.
