import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

export const config = { api: { bodyParser: { sizeLimit: '1mb' } } };

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { question, context } = req.body as { question: string; context: string };
  if (!question || !question.trim()) return res.status(400).json({ error: 'No question provided' });

  const systemPrompt = `You are MediScript, a helpful and trustworthy medical assistant. A patient has had their prescription decoded by AI and is now asking a follow-up question about it.

Prescription context:
${context}

Answer clearly and simply in the same language the question is asked in. Keep answers brief (2-4 sentences). Always end with: "Please consult your doctor for personalized advice." Never diagnose or prescribe.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
      temperature: 0.4,
      max_tokens: 300,
    });

    const answer = completion.choices[0]?.message?.content?.trim() || 'Sorry, I could not answer that.';
    res.status(200).json({ answer });
  } catch (err) {
    console.error('Ask AI error:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
}
