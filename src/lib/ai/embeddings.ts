import "server-only";

import { getVertexEmbedding } from '@/lib/gcp';

const EMBED_MODEL = process.env.EMBED_MODEL || 'vertex-text-embedding-004';
const PROJECT_ID = process.env.GCP_PROJECT_ID;
const LOCATION = 'us-central1'; // Vertex AI location

/**
 * Generate embeddings for a batch of texts using Vertex AI Text Embedding 004
 */
export async function embedTextBatch(texts: string[]): Promise<number[][]> {
  if (!PROJECT_ID) {
    throw new Error('GCP_PROJECT_ID environment variable is required');
  }

  if (texts.length === 0) {
    return [];
  }

  // Clean and prepare texts
  const cleanTexts = texts.map(text => 
    text.trim().replace(/\s+/g, ' ').substring(0, 8000) // Vertex AI limit
  );

  try {
    const client = getVertexEmbedding();
    const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${EMBED_MODEL}`;

    const instances = cleanTexts.map(text => ({
      content: text,
    }));

    const request = {
      endpoint,
      instances: instances.map(instance => ({
        stringValue: instance.content,
      })),
    };

    const [response] = await client.predict(request);
    
    if (!response.predictions) {
      throw new Error('No predictions returned from Vertex AI');
    }

    // Extract embeddings from response
    const embeddings: number[][] = response.predictions.map((prediction: any) => {
      if (!prediction.embeddings?.values) {
        throw new Error('Invalid prediction format');
      }
      return prediction.embeddings.values;
    });

    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate embedding for a single text
 */
export async function embedText(text: string): Promise<number[]> {
  const embeddings = await embedTextBatch([text]);
  return embeddings[0] || [];
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have the same dimension');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * Find most similar embeddings using cosine similarity
 */
export function findSimilarEmbeddings(
  queryEmbedding: number[],
  embeddings: Array<{ id: string; embedding: number[] }>,
  topK: number = 10
): Array<{ id: string; score: number }> {
  const similarities = embeddings.map(({ id, embedding }) => ({
    id,
    score: cosineSimilarity(queryEmbedding, embedding),
  }));

  return similarities
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(item => item.score > 0.1); // Filter out very low similarities
}

/**
 * Prepare text for embedding (combine title and description)
 */
export function prepareProductText(title: string, description?: string): string {
  const cleanTitle = title.trim();
  const cleanDescription = description?.trim() || '';
  
  // Combine title and description with separator
  const combinedText = cleanDescription 
    ? `${cleanTitle}. ${cleanDescription}`
    : cleanTitle;
  
  // Limit to reasonable length for embedding
  return combinedText.substring(0, 8000);
}
