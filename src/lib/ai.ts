// AI utilities using Vertex AI
import { textModel, embedModel, defaultSafety } from './vertex';

export async function aiGenerateText(
  systemPrompt: string,
  userPrompt: string,
  safetySettings = defaultSafety
) {
  try {
    const result = await textModel.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
      },
      // safetySettings, // Temporarily disabled for build
    });

    const response = await result.response;
    return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('AI text generation error:', error);
    throw new Error('AI text generation failed');
  }
}

export async function aiEmbed(texts: string[]) {
  try {
    const results = await Promise.all(
      texts.map(async (text) => {
        const result = await embedModel.generateContent({
          contents: [
            {
              role: 'user',
              parts: [{ text }],
            },
          ],
        });

        const response = await result.response;
        return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
      })
    );

    return results;
  } catch (error) {
    console.error('AI embedding error:', error);
    throw new Error('AI embedding failed');
  }
}