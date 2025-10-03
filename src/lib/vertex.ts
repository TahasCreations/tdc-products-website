import { VertexAI } from "@google-cloud/vertexai";

const vertex = new VertexAI({
  project: process.env.GCP_PROJECT_ID!,
  location: process.env.GCP_LOCATION || "europe-west1",
  googleAuthOptions: {
    credentials: {
      client_email: process.env.GCP_CLIENT_EMAIL!,
      private_key: process.env.GCP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
  },
});

export const textModel = vertex.getGenerativeModel({
  model: process.env.VERTEX_MODEL_ID || "gemini-2.5-flash",
});

export const embedModel = vertex.getGenerativeModel({
  model: process.env.VERTEX_EMBED_MODEL || "gemini-embedding-001",
});

export const defaultSafety = [
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];
