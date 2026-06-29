#!/bin/sh
# AI News Agent SaaS Single-Command Deploy Wizard
# Designed to guide non-technical users with zero coding experience.

clear
echo "========================================================="
echo "   🚀 AI NEWS AGENT SAAS SINGLE-CLICK DEPLOY WIZARD   "
echo "========================================================="
echo " This wizard will help you spin up your automated SaaS"
echo " publishing agency on Google Cloud Run, Railway, or Render."
echo "---------------------------------------------------------"
echo " Please select your preferred host platform:"
echo "  [1] Google Cloud Run (Recommended - Scale-to-Zero Free Tier)"
echo "  [2] Railway (Fastest setup with pre-built Redis queues)"
echo "  [3] Render (Zero-maintenance container hosting)"
echo "  [4] Exit Wizard"
echo "---------------------------------------------------------"
printf " Enter option [1-4]: "

read opt

case $opt in
  1)
    echo ""
    echo "---------------------------------------------------------"
    echo " ☁️ DEPLOYING TO GOOGLE CLOUD RUN"
    echo "---------------------------------------------------------"
    echo " Pre-requisite: Install the Google Cloud SDK CLI."
    echo " Then run the following single command to deploy:"
    echo ""
    echo "   gcloud run deploy ai-news-agent --source . --port 3000 --allow-unauthenticated"
    echo ""
    echo " This will automatically build your Docker container,"
    echo " upload it to Google Artifact Registry, and launch it"
    echo " with a public URL! No further setup required."
    echo "---------------------------------------------------------"
    ;;
  2)
    echo ""
    echo "---------------------------------------------------------"
    echo " 🚃 DEPLOYING TO RAILWAY"
    echo "---------------------------------------------------------"
    echo " Pre-requisite: Install the Railway CLI (npm install -g @railway/cli)"
    echo " Then execute this simple command:"
    echo ""
    echo "   railway up"
    echo ""
    echo " Railway will instantly detect our Dockerfile, build it,"
    echo " and assign you a secure public URL on port 3000."
    echo "---------------------------------------------------------"
    ;;
  3)
    echo ""
    echo "---------------------------------------------------------"
    echo " 🎨 DEPLOYING TO RENDER"
    echo "---------------------------------------------------------"
    echo " 1. Create a free account at https://render.com"
    echo " 2. Click 'New' -> 'Web Service'"
    echo " 3. Connect your GitHub repository"
    echo " 4. Render will automatically detect our Dockerfile"
    echo " 5. Under 'Environment Variables', set:"
    echo "    - NODE_ENV=production"
    echo " 6. Click 'Deploy Web Service'!"
    echo "---------------------------------------------------------"
    ;;
  *)
    echo "Exiting wizard. Your configuration remains secure."
    exit 0
    ;;
esac

echo " Need help? View the full step-by-step documentation on"
echo " your SaaS dashboard under the 'Docs & System Guide' tab!"
echo "========================================================="
