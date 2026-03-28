````md
# AI Document Analyzer

An AI-powered document analysis application that accepts **PDF** and **DOCX** files, extracts their text, and generates a structured analysis using an LLM.

The application returns:

- **Title**
- **Author**
- **Summary**
- **Main sections**
- **Extracted text preview**

## Stack

### Frontend
- React
- Vite
- TypeScript
- shadcn/ui
- Axios
- Lucide React

### Backend
- FastAPI
- Uvicorn
- PyPDF
- python-docx
- python-dotenv
- requests

### AI
- OpenRouter
- openai/gpt-4o-mini

### Deployment
- Backend hosted on a VPS
- Backend exposed publicly via Cloudflare Quick Tunnel
- Frontend deployed through GitHub Actions via FTP

---

# Features

- Upload PDF and DOCX files
- Extract text from standard PDFs and Word documents
- OCR fallback for scanned or weak-text PDFs
- AI-generated structured summary and section breakdown
- Clean document analysis UI
- Error handling for invalid files and failed extraction
- Public backend access without needing a custom domain

---

# Project Structure

```bash
project-root/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── types/
│   ├── package.json
│   └── .env
│
└── .github/
    └── workflows/
        ├── deploy-backend.yml
        └── deploy.yml
````

---

# How It Works

1. A user uploads a PDF or DOCX file from the frontend.
2. The frontend sends the file to the FastAPI backend using `multipart/form-data`.
3. The backend validates the uploaded file.
4. The backend extracts text:

   * PDF using `pypdf`
   * DOCX using `python-docx`
5. The extracted text is sent to OpenRouter for structured analysis.
6. The frontend displays:

   * title
   * author
   * summary
   * main sections
   * text preview

---

# Prerequisites

Make sure you have:

* Node.js 18+
* npm
* Python 3.10+
* pip
* Git
* An OpenRouter API key
* A VPS for backend hosting
* `cloudflared` installed on the VPS if using Quick Tunnel

---

# Environment Variables

## Backend `.env`

Create this file inside `backend/.env`

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-4o-mini
FRONTEND_URL=http://localhost:5173
APP_NAME=AI Document Analyzer
```

## Frontend `.env`

Create this file inside `frontend/.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_APP_ENV=development
```

For production, `VITE_API_BASE_URL` should point to the Cloudflare tunnel URL.

---

# Local Development Setup

## 1. Clone the Repository

```bash
git clone https://github.com/NegusDev/document-assistant.git
cd document-assistant
```

---

## 2. Backend Setup

Move into the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv .venv
```

Activate it:

### Linux / macOS

```bash
source .venv/bin/activate
```

### Windows

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Create the backend `.env` file:

```bash
nano .env
```

Add:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=mistralai/mistral-small-3.2-24b-instruct
YOUR_SITE_URL=http://localhost:5173
YOUR_APP_NAME=AI Document Analyzer
```

Run the backend:

```bash
uvicorn app.main:app --reload
```

The backend should now be available at:

```text
http://127.0.0.1:8000
```

Test the health endpoint:

```bash
curl http://127.0.0.1:8000/health
```

Open Swagger docs:

```text
http://127.0.0.1:8000/docs
```

---

## 3. Frontend Setup

Open a new terminal and move into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the frontend `.env` file:

```bash
nano .env
```

Add:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_APP_ENV=development
```

Run the frontend:

```bash
npm run dev
```

The frontend should now be available at:

```text
http://localhost:5173
```

---

# Running the Full Application

Make sure both services are running:

* Backend: `http://127.0.0.1:8000`
* Frontend: `http://localhost:5173`

Then:

1. Open the frontend in your browser
2. Upload a PDF or DOCX file
3. Click **Analyze Document**
4. Review the result

---

# API Reference

## POST `/api/analyze`

Analyzes an uploaded PDF or DOCX file.

### Request

* Method: `POST`
* Content-Type: `multipart/form-data`

### Form data

| Key  | Type | Required | Description          |
| ---- | ---- | -------- | -------------------- |
| file | File | Yes      | PDF or DOCX document |

### Example Response

```json
{
  "filename": "sample.pdf",
  "extraction_method": "direct",
  "extracted_text_preview": "This is a preview of the extracted text...",
  "analysis": {
    "title": "Sample Document",
    "author": "John Doe",
    "summary": "This document explains...",
    "main_sections": [
      {
        "heading": "Introduction",
        "content": "This section introduces the topic..."
      }
    ]
  }
}
```

---

# Testing the Backend

You can test the backend in several ways.

## Swagger UI

Open:

```text
http://127.0.0.1:8000/docs
```

Then:

* Expand `POST /api/analyze`
* Click **Try it out**
* Upload a PDF or DOCX
* Execute

## Postman / Insomnia

Use:

* Method: `POST`
* URL: `http://127.0.0.1:8000/api/analyze`
* Body: `form-data`
* Key: `file`
* Type: `File`

---

# First-Time VPS Deployment for Backend

This section is for the initial manual backend deployment before automation.

## 1. SSH into the VPS

```bash
ssh youruser@YOUR_VPS_IP
```

## 2. Install required packages

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip git curl
```

## 3. Create the project directory

```bash
sudo mkdir -p /var/www/doc-analyzer
sudo chown -R $USER:$USER /var/www/doc-analyzer
cd /var/www/doc-analyzer
```

## 4. Clone the repository

```bash
git clone https://github.com/NegusDev/document-assistant.git .
```

## 5. Set up backend dependencies

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

## 6. Create the backend production `.env`

```bash
nano /var/www/doc-analyzer/backend/.env
```

Example:

```env
OPENROUTER_API_KEY=your_real_openrouter_key
OPENROUTER_MODEL=mistralai/mistral-small-3.2-24b-instruct
FRONTEND_URL=https://your-frontend-url.com
APP_NAME=AI Document Analyzer
```

## 7. Test the backend manually

```bash
cd /var/www/doc-analyzer/backend
source .venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

In another terminal:

```bash
curl http://127.0.0.1:8000/health
```

If that works, stop the manual server and continue.

---

# Setting Up FastAPI as a systemd Service

Create the service file:

```bash
sudo nano /etc/systemd/system/doc-analyzer-api.service
```

Paste:

```ini
[Unit]
Description=Document Analyzer FastAPI Service
After=network.target

[Service]
User=youruser
Group=youruser
WorkingDirectory=/var/www/doc-analyzer/backend
EnvironmentFile=/var/www/doc-analyzer/backend/.env
ExecStart=/var/www/doc-analyzer/backend/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Replace `youruser` with your actual VPS user.

Reload and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable doc-analyzer-api
sudo systemctl start doc-analyzer-api
```

Check status:

```bash
sudo systemctl status doc-analyzer-api
```

Check logs:

```bash
journalctl -u doc-analyzer-api -f
```

Test health:

```bash
curl http://127.0.0.1:8000/health
```

---

# Cloudflare Quick Tunnel Setup

Once the backend is running locally on the VPS, expose it publicly using Cloudflare Quick Tunnel.

## 1. Install cloudflared

Try:

```bash
sudo apt update
sudo apt install cloudflared
```

If unavailable, install manually:

```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

Check version:

```bash
cloudflared --version
```

## 2. Start a Quick Tunnel manually

```bash
cloudflared tunnel --url http://127.0.0.1:8000
```

Cloudflare will generate a temporary public URL like:

```text
https://random-name.trycloudflare.com
```

Test:

```text
https://random-name.trycloudflare.com/health
https://random-name.trycloudflare.com/docs
```

## 3. Keep the tunnel running in the background with systemd

Create the service:

```bash
sudo nano /etc/systemd/system/cloudflared-tunnel.service
```

Paste:

```ini
[Unit]
Description=Cloudflare Tunnel (Quick Tunnel)
After=network.target

[Service]
User=youruser
ExecStart=/usr/bin/cloudflared tunnel --url http://127.0.0.1:8000 --no-autoupdate
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Reload and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable cloudflared-tunnel
sudo systemctl start cloudflared-tunnel
```

Check status:

```bash
sudo systemctl status cloudflared-tunnel
```

Check logs:

```bash
journalctl -u cloudflared-tunnel -n 50 --no-pager
```

The tunnel URL will appear in the service logs.

To follow the logs live:

```bash
journalctl -u cloudflared-tunnel -f
```

To restart and generate a new URL:

```bash
sudo systemctl restart cloudflared-tunnel
```

---

# Backend Manual Deployment After Changes

Until CI/CD is in place, manual deployment looks like this:

```bash
ssh youruser@YOUR_VPS_IP
cd /var/www/doc-analyzer
git pull origin main
cd backend
source .venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart doc-analyzer-api
curl http://127.0.0.1:8000/health
```

---

# Backend CI/CD with GitHub Actions

The backend can be deployed automatically on push to `main` using SSH into the VPS.

Typical flow:

1. GitHub Actions connects to the VPS
2. Pulls the latest code
3. Updates Python dependencies
4. Restarts the FastAPI service
5. Runs a health check

Example GitHub secrets:

* `VPS_HOST`
* `VPS_USER`
* `VPS_PORT`
* `VPS_SSH_KEY`

Example backend deployment workflow:

```yaml
name: Deploy backend

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'
      - '.github/workflows/deploy-backend.yml'

jobs:
  deploy-backend:
    runs-on: ubuntu-latest

    steps:
      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh-keyscan -p "${{ secrets.VPS_PORT }}" -H "${{ secrets.VPS_HOST }}" >> ~/.ssh/known_hosts

      - name: Deploy backend on VPS
        run: |
          ssh -p "${{ secrets.VPS_PORT }}" "${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }}" << 'EOF'
            set -e

            cd /var/www/doc-analyzer
            git fetch origin
            git reset --hard origin/main

            cd backend

            if [ ! -d ".venv" ]; then
              python3 -m venv .venv
            fi

            . .venv/bin/activate
            pip install --upgrade pip
            pip install -r requirements.txt

            sudo systemctl restart doc-analyzer-api

            sleep 5
            curl --fail http://127.0.0.1:8000/health
          EOF
```

---

# Frontend Deployment

The frontend is deployed via GitHub Actions using FTP whenever changes are merged to `main`.

## Frontend deployment workflow used in this project

```yaml
name: Deploy Frontend

on:
  push:
    branches:
      - main
    paths:
      - 'frontend/**'
      - '.github/workflows/deploy.yml'

jobs:
  deploy:
    name: 🚀 Deploy React App via FTP
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend

    steps:
      - name: 🔄 Checkout Repository
        uses: actions/checkout@v3

      - name: 📦 Install Node.js and Dependencies
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: 🧹 Clean install (fix native binding resolution)
        run: rm -rf node_modules package-lock.json

      - run: npm install --force

      - name: 🔧 Fix Tailwind native binding for Linux CI
        run: npm install @tailwindcss/oxide-linux-x64-gnu --no-save --force

      - name: 🌎 Create Environment File
        run: |
          echo "VITE_API_BASE_URL=${{ secrets.VITE_API_BASE_URL }}" >> .env
          echo "VITE_APP_ENV=production" >> .env

      - name: 🛠️ Build Project
        run: npm run build

      - name: 📂 Deploy via FTP
        uses: SamKirkland/FTP-Deploy-Action@4.3.3
        with:
          server: ${{ secrets.FTP_HOST }}
          username: ${{ secrets.FTP_USER }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: frontend/dist/
          server-dir: document-analyzer.cns.ug/
          exclude: |
            **/.git*
            **/.github*
            **/frontend/dist/.htaccess
          dangerous-clean-slate: true
```

## Required GitHub Secrets for frontend deployment

* `FTP_HOST`
* `FTP_USER`
* `FTP_PASSWORD`
* `VITE_API_BASE_URL`

`VITE_API_BASE_URL` should be set to the active backend Cloudflare tunnel URL.

Example:

```text
https://random-name.trycloudflare.com
```

## Frontend build notes

The workflow:

* checks out the code
* installs Node.js 18
* removes `node_modules` and `package-lock.json`
* installs dependencies again with force
* installs Tailwind Linux native binding for CI compatibility
* creates the production `.env`
* builds the project
* deploys the `frontend/dist/` folder over FTP

---

# Production Notes

## Current production architecture

```text
User
  → Frontend (React app deployed via FTP)
  → Cloudflare Quick Tunnel URL
  → FastAPI backend on VPS
  → OpenRouter
```

## Important limitation

Cloudflare Quick Tunnel URLs are temporary and can change when the service restarts. That means:

* frontend API URL may need to be updated if a new tunnel URL is generated
* `VITE_API_BASE_URL` secret should be updated whenever the tunnel changes
* frontend may need to be redeployed after that secret change

For a more stable production setup, use:

* a proper Cloudflare named tunnel
* a real domain or subdomain
* or a managed deployment platform

---

# Troubleshooting

## Backend does not start

Check:

```bash
sudo systemctl status doc-analyzer-api
journalctl -u doc-analyzer-api -n 50 --no-pager
```

Common causes:

* missing `.env`
* wrong Python path
* missing package
* wrong working directory
* wrong FastAPI entry point

## Local backend health fails

Check:

```bash
curl http://127.0.0.1:8000/health
```

If this fails, fix the backend service first.

## Cloudflare tunnel URL fails

Check backend first:

```bash
curl http://127.0.0.1:8000/health
```

Then check tunnel logs:

```bash
journalctl -u cloudflared-tunnel -n 50 --no-pager
```

To generate a new tunnel URL:

```bash
sudo systemctl restart cloudflared-tunnel
```

Then check logs again for the new `trycloudflare.com` URL.

## Frontend cannot reach backend

Check:

* `VITE_API_BASE_URL`
* CORS configuration in FastAPI
* Cloudflare tunnel health
* whether the backend is running

## FTP deployment fails

Check:

* FTP secrets
* destination path `document-analyzer.cns.ug/`
* build success before deployment
* whether the hosting account has enough permissions

---

# Useful Commands

## Backend

Start manually:

```bash
uvicorn app.main:app --reload
```

Restart service:

```bash
sudo systemctl restart doc-analyzer-api
```

View logs:

```bash
journalctl -u doc-analyzer-api -f
```

## Cloudflare Tunnel

Restart tunnel:

```bash
sudo systemctl restart cloudflared-tunnel
```

View logs:

```bash
journalctl -u cloudflared-tunnel -f
```

## Frontend

Run locally:

```bash
npm run dev
```

Build locally:

```bash
npm run build
```

---

# Known Limitations

* Quick Tunnel URL is temporary
* OCR can be slower on scanned or image-heavy PDFs
* Title and author may not always be clearly present in the source file
* Large documents may need truncation before LLM analysis
* Frontend production deployments depend on the active tunnel URL being current

---

# Future Improvements

* Replace Quick Tunnel with a named Cloudflare tunnel
* Add a custom domain for the backend
* Queue-based document processing for larger files
* Downloadable analysis result as JSON or PDF
* Better metadata extraction
* Better OCR handling for complex document layouts
* Store document history
* Add authentication and user sessions

---

# Submission Notes

This project was built to demonstrate:

* file upload handling
* text extraction for PDF and DOCX
* OCR fallback
* structured AI summarization
* clean frontend UX
* deployable full-stack architecture
* CI/CD for both frontend and backend

---

# License

This project is for demo and assessment purposes unless otherwise stated.

```

A couple of edits you should still make before pasting it in:
- replace `YOUR_USERNAME/YOUR_REPO`
- replace `youruser`
- confirm the exact backend workflow filename
- confirm the real FTP target directory if needed
```
