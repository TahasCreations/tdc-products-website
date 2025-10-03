// Google Cloud Vertex AI client
import { VertexAI } from '@google-cloud/vertexai';

const project = process.env.GOOGLE_CLOUD_PROJECT_ID || 'your-project-id';
const location = process.env.GCP_LOCATION || 'us-central1';
const modelId = process.env.VERTEX_MODEL_ID || 'gemini-2.5-flash';
const embedModelId = process.env.VERTEX_EMBED_MODEL || 'gemini-embedding-001';

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project,
  location,
});

// Text generation model
export const textModel = vertexAI.getGenerativeModel({
  model: modelId,
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.4,
    topP: 0.8,
    topK: 40,
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH' as any,
      threshold: 'BLOCK_MEDIUM_AND_ABOVE' as any,
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as any,
      threshold: 'BLOCK_MEDIUM_AND_ABOVE' as any,
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as any,
      threshold: 'BLOCK_MEDIUM_AND_ABOVE' as any,
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT' as any,
      threshold: 'BLOCK_MEDIUM_AND_ABOVE' as any,
    },
  ],
});

// Embedding model
export const embedModel = vertexAI.getGenerativeModel({
  model: embedModelId,
});

// Default safety settings
export const defaultSafety = [
  {
    category: 1, // HARM_CATEGORY_HATE_SPEECH
    threshold: 3, // BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: 2, // HARM_CATEGORY_DANGEROUS_CONTENT
    threshold: 3, // BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: 3, // HARM_CATEGORY_SEXUALLY_EXPLICIT
    threshold: 3, // BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: 4, // HARM_CATEGORY_HARASSMENT
    threshold: 3, // BLOCK_MEDIUM_AND_ABOVE
  },
];