# CivicPulse: AI-Powered Civic Reporting System

CivicPulse is an advanced, production-grade platform designed to report and track civic infrastructure issues automatically using AI-vision.

## 🚀 Key Features

- **AI Detection**: Uses Groq-powered LLaMA 4 Scout for zero-shot image classification and detailed civic descriptions.
- **Multilingual Support**: Fully localized in English, Hindi, and Marathi.
- **Real-time Persistence**: Direct integration with Supabase for tracking issue status and location.
- **Modern UI**: Built with Next.js 15, Tailwind CSS, and Lucide icons for a premium experience.

## 🛠️ Technology Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Groq SDK (LLaMA Vision)
- **Database**: Supabase (PostgreSQL)
- **AI Model**: `meta-llama/llama-4-scout-17b-16e-instruct`

## 📦 Setting Up

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/illuminatiAyush/CIVIC-PULSE.git
    npm install
    ```
2.  **Environment Setup**:
    Copy `.env.example` to `.env` and add your keys:
    ```bash
    cp .env.example .env
    ```
    Required keys:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `GROQ_API_KEY`

3.  **Run Development**:
    ```bash
    npm run dev
    ```

## 🌐 Roadmap

- [x] LLaMA Vision Integration
- [x] Multi-language State Management
- [x] Supabase Result Persistence
- [ ] Direct Map Pinning
- [ ] Image Storage (Supabase Buckets)

---
Built with pride for local governance.

