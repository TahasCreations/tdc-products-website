import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // 0-1
  confidence: number;
  highlights: string[];
}

export class SentimentAnalyzer {
  /**
   * Analyze text sentiment
   */
  static async analyze(text: string): Promise<SentimentResult> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis expert. Analyze the text and provide sentiment with score and confidence.',
          },
          {
            role: 'user',
            content: `Analyze sentiment: "${text}"`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        sentiment: result.sentiment || 'neutral',
        score: result.score || 0.5,
        confidence: result.confidence || 0.8,
        highlights: result.highlights || [],
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return {
        sentiment: 'neutral',
        score: 0.5,
        confidence: 0,
        highlights: [],
      };
    }
  }

  /**
   * Analyze product reviews
   */
  static async analyzeReviews(reviews: string[]): Promise<{
    averageSentiment: number;
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
  }> {
    const results = await Promise.all(reviews.map(r => this.analyze(r)));
    
    const averageSentiment = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const positiveCount = results.filter(r => r.sentiment === 'positive').length;
    const negativeCount = results.filter(r => r.sentiment === 'negative').length;
    const neutralCount = results.filter(r => r.sentiment === 'neutral').length;

    return {
      averageSentiment,
      positiveCount,
      negativeCount,
      neutralCount,
    };
  }
}

