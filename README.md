# MediScript — AI Prescription Decoder

Decode any Indian doctor's handwriting in seconds. Powered by GPT-4o Vision.

## Features

- Upload or photograph a prescription → GPT-4o reads the handwriting
- Identifies all medicines with dosage, purpose, and side effects
- Checks for drug interactions
- Full translations in **English, Hindi (हिंदी), and Kannada (ಕನ್ನಡ)**
- Works on any device, no login required

## Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS 4 + Vite
- **Backend:** Vercel Serverless Function (Node.js)
- **AI:** Groq API — Llama 4 Scout Vision (`meta-llama/llama-4-scout-17b-16e-instruct`) — **free tier**

---

## Setup

### 1. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Set your OpenAI API key

Get a key at https://platform.openai.com/api-keys

Create a `.env.local` file:
\`\`\`
OPENAI_API_KEY=sk-...
\`\`\`

### 3. Run locally with Vercel CLI (required for API routes)
\`\`\`bash
npm install -g vercel
vercel dev
\`\`\`

> Opens at http://localhost:3000

---

## Deploy to Vercel

\`\`\`bash
vercel --prod
\`\`\`

Add environment variable in Vercel dashboard:
- **Key:** `GROQ_API_KEY`  
- **Value:** your Groq key

---

## API

### `POST /api/decode`

**Body:** `{ image: string (base64), mimeType: string, fileName: string }`  
**Response:** Prescription object with medications, translations, and interaction alerts.

---

*Built for AI Builders Hackathon — OpenAI × Outskill*

---

# Original Vite Template Notes

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
