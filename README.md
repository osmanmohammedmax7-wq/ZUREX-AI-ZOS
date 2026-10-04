# See README for setup instructions.

This project provides a premium glassmorphism executive AI dashboard called ZUREX AI — ZOS.

## Features
- Warm black premium design
- Chat, Voice, Search, Tasks, and Settings screens
- Local Ollama-ready AI integration
- Task progress and status panels
- Responsive UI for desktop and mobile

## Run locally
1. Install dependencies:
   npm install
2. Start Ollama locally:
   ollama serve
3. Pull a model if needed:
   ollama pull llama3.1
4. Start the app:
   npm run dev

## Build
npm run build

## Notes
- The interface uses a local Ollama endpoint at `http://localhost:11434/api/generate`.
- If Ollama is not available, the app gracefully falls back to a simulated executive AI response.
