# OnePrompt – AI App Studio Setup Guide

Welcome to OnePrompt, the premium AI-powered app builder.

## Local Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_key
   OPENAI_API_KEY=your_openai_key_optional
   MONGODB_URI=your_mongodb_atlas_uri
   AI_PROVIDER=gemini
   ```

3. **Database Configuration**
   - Head to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - Create a free cluster.
   - Get your Connection String and replace `<password>` with your database user password.

4. **API Key Sources**
   - **Gemini**: Get it from [Google AI Studio](https://aistudio.google.com/app/apikey).
   - **OpenAI**: Get it from [OpenAI Dashboard](https://platform.openai.com/api-keys).

5. **Run Locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the studio.

## Vercel Deployment

1. **Push to GitHub**
   Create a new repository and push your code.

2. **Deploy on Vercel**
   - Link your GitHub repository to Vercel.
   - Add all environment variables from your `.env` file in the Vercel project settings.

3. **Build Command**
   Vercel will automatically detect the Next.js/Vite project. Ensure the build command is `npm run build`.

## Demo Flow
1. **Prompt**: Enter "Build a responsive habit tracker with streak counter."
2. **Generate**: Click the generate button and watch the AI architectural blueprint appear.
3. **Refine**: Edit code in real-time or use the "Improve App" feature to suggest UI tweaks.
4. **Save**: Persist your project to MongoDB Atlas.
5. **Download**: Export your app as a production-ready ZIP file.
