import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Initialize secure GenAI client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API router endpoint for AI Advisor / Academic Co-Pilot
  app.post("/api/ai/advisor", async (req, res) => {
    try {
      const { message, history, profile } = req.body;

      // Construct a highly motivational, elite academic advisor persona (YC startup-builder style)
      const systemInstruction = `You are "Mentoria AI Mentor", an ultra-elite academic advisor, college admissions strategist, and Olympiad/Research program coach (possessing a direct, highly-encouraging YC startup founder style).
Your user is a high school student named ${profile?.displayName || "Scholar"} in Grade ${profile?.grade || "10"}.
Selected tracks: ${profile?.interests?.join(", ") || "STEM, Business"}.
Current goals: ${profile?.goals?.join("; ") || "Apply to research programs"}.

Help the student craft their academic strategy, optimize application plans (e.g. for YYGS, Wharton, USACO), explain complex Olympiad concepts (like dynamic programming, math formulas), and build confidence.
Be brief, ultra-focused, clear, and highly supportive. Use formatting like bullet points and bold text where helpful. Never output more than 2-3 short paragraphs or 150 words per response to keep interaction punchy and highly energetic.`;

      // Create a clean chat context
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      // Simple playback of history to seed the chat context if present
      if (Array.isArray(history) && history.length > 0) {
        // Feed previous messages into state
        // For simple API endpoint, we can just send the final message with history appended as context or use the API properly
      }

      const response = await chat.sendMessage({ message: message || "Hello! Introduce yourself." });
      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini Advisor API Error:", err);
      res.status(500).json({ error: "Could not process AI guidance at this moment. Please double check your environment variables." });
    }
  });

  // Serve static assets / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[info] Mentoria Hub Server booted on http://localhost:${PORT}`);
  });
}

startServer();
