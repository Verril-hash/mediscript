import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const DECODE_PROMPT = `You are MediScript, a medical AI assistant specializing in Indian prescriptions. Analyze this prescription image carefully and extract ALL visible information.

CRITICAL RULES FOR EXTRACTION:
- "patient" = the patient's name written on the prescription (look for "Name:", "Patient:", or a name written at the top). NEVER use a medicine name as the patient name. If unclear, use "Unknown Patient".
- "clinic" = the doctor's name and hospital/clinic printed on the letterhead (usually at the top of the prescription paper).
- "medications" = ONLY actual medicines/drugs prescribed. Do NOT include patient name, clinic name, date, or any non-medicine text as a medication. A medicine name is typically a drug brand or generic name (e.g. Dolo, Pantocid, Amoxicillin, Paracetamol).
- If you see text like "B&A", "Rx", "Name:", "Age:", "Date:" — these are NOT medicines.
- Only include entries in the medications array if you are reasonably confident they are actual drugs.

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:

{
  "patient": "Patient name from the prescription (or 'Unknown Patient' if truly not visible)",
  "clinic": "Clinic/hospital and doctor name from the letterhead (or 'Unknown Clinic')",
  "date": "Date shown on prescription (or 'Today')",
  "medications": [
    {
      "id": "med_1",
      "name": "Brand Name (Generic Name) - e.g. Dolo 650 (Paracetamol)",
      "confidence": 95,
      "translations": {
        "en": {
          "purpose": "Plain English explanation of what this medicine treats",
          "dosage": "Clear dosage instructions e.g. '1 tablet twice daily after meals'",
          "duration": "Duration e.g. 'Take for 5 days'",
          "sideEffects": ["Common side effect 1", "Common side effect 2", "Common side effect 3"],
          "interactionWarning": "Specific timing or interaction warning for this medicine"
        },
        "hi": {
          "purpose": "इस दवा का उद्देश्य हिंदी में",
          "dosage": "खुराक के निर्देश हिंदी में",
          "duration": "अवधि हिंदी में",
          "sideEffects": ["हिंदी में दुष्प्रभाव 1", "हिंदी में दुष्प्रभाव 2"],
          "interactionWarning": "हिंदी में चेतावनी"
        },
        "kn": {
          "purpose": "ಕನ್ನಡದಲ್ಲಿ ಉದ್ದೇಶ",
          "dosage": "ಕನ್ನಡದಲ್ಲಿ ಡೋಸೇಜ್ ಸೂಚನೆಗಳು",
          "duration": "ಕನ್ನಡದಲ್ಲಿ ಅವಧಿ",
          "sideEffects": ["ಕನ್ನಡದಲ್ಲಿ ಅಡ್ಡ ಪರಿಣಾಮ 1", "ಕನ್ನಡದಲ್ಲಿ ಅಡ್ಡ ಪರಿಣಾಮ 2"],
          "interactionWarning": "ಕನ್ನಡದಲ್ಲಿ ಎಚ್ಚರಿಕೆ"
        }
      }
    }
  ],
  "interactionAlert": {
    "en": "Summary of any drug interactions found, or 'No dangerous drug interactions found between the prescribed medicines.'",
    "hi": "दवा परस्पर क्रिया का सारांश हिंदी में",
    "kn": "ಔಷಧಗಳ ಪರಸ್ಪರ ಕ್ರಿಯೆಯ ಸಾರಾಂಶ ಕನ್ನಡದಲ್ಲಿ"
  }
}

Additional rules:
- Number med IDs sequentially: "med_1", "med_2", etc.
- confidence: 85-99 based on handwriting clarity
- Include real, helpful medical information (not generic disclaimers)
- Check for actual drug interactions between all listed medications
- Provide natural, fluent translations in Hindi (Devanagari script) and Kannada (ಕನ್ನಡ script)
- If you cannot read the handwriting clearly, make your best interpretation and lower the confidence score
- Be specific about dosage timing (before/after meals, morning/evening)
- For sideEffects, list the 3 most common ones patients should know about`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key not configured. Set GROQ_API_KEY environment variable.' });
  }

  const { image, mimeType, fileName } = req.body as {
    image: string;
    mimeType: string;
    fileName: string;
  };

  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    const client = new Groq({ apiKey });

    const response = await client.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType || 'image/jpeg'};base64,${image}`,
                detail: 'high',
              },
            },
            {
              type: 'text',
              text: DECODE_PROMPT,
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    const parsed = JSON.parse(content);

    // Build prescription object matching the frontend Prescription interface
    const newRxId = `rx_ai_${Date.now()}`;
    const prescription = {
      id: newRxId,
      name: fileName || 'prescription.jpg',
      date: parsed.date || 'Just now',
      patient: parsed.patient || 'Unknown Patient',
      clinic: parsed.clinic || 'Unknown Clinic',
      medications: (parsed.medications || []).map((med: Record<string, unknown>, idx: number) => ({
        ...med,
        id: (med.id as string) || `med_${idx + 1}`,
      })),
      interactionAlert: parsed.interactionAlert || {
        en: 'No dangerous drug interactions found between the prescribed medicines.',
        hi: 'निर्धारित दवाओं के बीच कोई खतरनाक दवा परस्पर क्रिया नहीं मिली।',
        kn: 'ನಿರ್ಧರಿಸಿದ ಔಷಧಗಳ ನಡುವೆ ಯಾವುದೇ ಅಪಾಯಕಾರಿ ಔಷಧಗಳ ಪರಸ್ಪರ ಕ್ರಿಯೆ ಕಂಡುಬಂದಿಲ್ಲ.',
      },
    };

    return res.status(200).json(prescription);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Decode error:', message);
    return res.status(500).json({
      error: 'Failed to decode prescription',
      details: message,
    });
  }
}
