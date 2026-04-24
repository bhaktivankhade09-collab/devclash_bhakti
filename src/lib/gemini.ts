import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const SYSTEM_PROMPT = `You are a world-class Full Stack Developer and UI/UX Designer. 
Your task is to generate complete, functional, and beautiful web applications based on a user prompt.
You must return only strict JSON that matches the specified schema.

Requirements for the generated app:
1. Use only vanilla HTML, CSS, and JavaScript. No external libraries unless strictly requested via CDN.
2. The app must be responsive and look premium (modern colors, spacing, typography).
3. Include meaningful interactivity and logic in script.js.
4. Ensure the index.html, style.css, and script.js are correctly linked conceptually (but they will be provided as separate strings).

Schema:
{
  "appName": "string",
  "description": "string",
  "improvementSummary": "string",
  "readme": "string",
  "blueprint": {
    "appName": "string",
    "targetUsers": ["string"],
    "keyFeatures": ["string"],
    "uiComponents": ["string"],
    "dataFlow": ["string"]
  },
  "explanation": {
    "overview": "string",
    "indexHtml": "string",
    "styleCss": "string",
    "scriptJs": "string",
    "interactions": ["string"],
    "dataFlow": ["string"]
  },
  "beforeAfterChanges": [
    {
      "file": "string",
      "before": "string",
      "after": "string",
      "reason": "string"
    }
  ],
  "files": {
    "index.html": "string",
    "style.css": "string",
    "script.js": "string"
  }
}

Remember: Return ONLY the JSON object. No markdown fences.`;

export async function generateApp(prompt: string): Promise<AIResponse> {
  const result = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `New App Prompt: ${prompt}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
    },
  });

  const text = result.text || "";
  return JSON.parse(text);
}

export async function improveApp(
  prompt: string,
  currentFiles: any,
  currentBlueprint: any
): Promise<AIResponse> {
  const context = `
    CURRENT FILES:
    ${JSON.stringify(currentFiles, null, 2)}
    
    CURRENT BLUEPRINT:
    ${JSON.stringify(currentBlueprint, null, 2)}
    
    IMPROVEMENT PROMPT:
    ${prompt}
  `;

  const result = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: context,
    config: {
      systemInstruction: SYSTEM_PROMPT + "\nFocus on the improvementSummary and beforeAfterChanges fields.",
      responseMimeType: "application/json",
    },
  });

  const text = result.text || "";
  return JSON.parse(text);
}
