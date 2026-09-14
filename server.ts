import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory shares store
const shareCounts: Record<string, number> = {};

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString(), platform: 'Danish SSC CGL Study Hub' });
});

// Real Share Counter API
app.get('/api/shares/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  res.json({ slug, shares: shareCounts[slug] || 0 });
});

app.post('/api/shares/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  shareCounts[slug] = (shareCounts[slug] || 0) + 1;
  res.json({ slug, shares: shareCounts[slug] });
});

// Gemini AI Tutor Endpoint
app.post('/api/tutor', async (req: Request, res: Response) => {
  try {
    const { message, chapterContext, questionContext } = req.body;

    if (!message && !questionContext) {
      return res.status(400).json({ error: 'Message or question context is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply: `## From Danish's Notes\n\nI am currently in local reference mode. Here is the direct guidance:\n\n- **Focus**: Review the chapter rules and formulas in the notes above.\n- **Discipline**: Ensure you isolate head nouns in English and reduce ratios without pen in Quant.\n\n*To enable dynamic AI generation, please ensure your GEMINI_API_KEY is configured in Settings.*`,
        source: 'local_notes_fallback',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build structured prompt grounded in Danish's study material
    let contextPrompt = `You are the personal AI Study Tutor for Danish Fatma, preparing for SSC CGL 2026 (Tier-I on 30 September 2026), with curriculum designed by Tauqeer Ashraf.
You must adhere strictly to these rules:
1. Distinguish between:
   ## From Danish's Notes
   and
   ## Additional Explanation
2. For syllabus and rule questions, reference the student's study notes first. If a point is absent from the provided notes, say: "This point isn't covered in the current study notes." Then give an accurate, marked explanation.
3. Be encouraging, concise, rigorous, and exam-focused. Explain grammar by isolating head nouns/antecedents. Explain Mathematics using short methods and fractional equivalents.
4. Never fabricate SSC exam statistics or question frequencies.\n\n`;

    if (chapterContext) {
      contextPrompt += `CURRENT LESSON CONTEXT:\nSubject: ${chapterContext.subject || 'General'}\nChapter: ${chapterContext.chapterTitle || 'Active Topic'}\nSection: ${chapterContext.currentSection || 'Overview'}\n`;
      if (chapterContext.rules && chapterContext.rules.length > 0) {
        contextPrompt += `Key Rules from Notes:\n${chapterContext.rules.join('\n')}\n`;
      }
      if (chapterContext.formulas && chapterContext.formulas.length > 0) {
        contextPrompt += `Key Formulas from Notes:\n${chapterContext.formulas.join('\n')}\n`;
      }
      contextPrompt += `\n`;
    }

    if (questionContext) {
      contextPrompt += `QUESTION BEING DISCUSSED:\nQuestion: "${questionContext.question}"\nOptions: ${questionContext.options ? JSON.stringify(questionContext.options) : 'N/A'}\nStudent Chosen Option: "${questionContext.userOption}"\nCorrect Official Option: "${questionContext.correctOption}"\nOfficial SSC Explanation: "${questionContext.explanation}"\n\nExplain clearly to Danish why her answer was incorrect, which trap she fell into (concept, proximity, calculation, rushed reading), and how to reliably answer this in under 40 seconds on exam day.\n`;
    }

    const userQuery = message ? `Student Prompt: ${message}` : `Explain the mistake and trap in this question.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${contextPrompt}\n${userQuery}` }],
        },
      ],
    });

    const reply = response.text || "I was unable to generate an explanation at this moment. Please review the official explanation in the notes.";
    return res.json({ reply, source: 'gemini' });
  } catch (error: unknown) {
    console.error('Tutor API Error:', error);
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Tutor service encountered an issue.',
      details: errMessage,
      fallback: "Tutor is temporarily unavailable. Your notes and tests are still available."
    });
  }
});

// Setup Vite or Static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Danish SSC CGL Study Hub running on http://0.0.0.0:${PORT}`);
  });
}

start();
