import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-dummy',
});

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// AI Content Generation
export const generateBlogContent = async (topic: string, keywords: string[]): Promise<AIResponse> => {
  try {
    const prompt = `
      Create a comprehensive blog post about "${topic}" for TDC Market, a multi-category marketplace specializing in figures, collectibles, fashion, electronics, and home goods.
      
      Keywords to include: ${keywords.join(', ')}
      
      The post should be:
      - 800-1200 words
      - Engaging and informative
      - Include practical tips and insights
      - Use a friendly, conversational tone
      - Include relevant examples
      - Be SEO-optimized
      
      Format the response as JSON with:
      {
        "title": "Compelling title",
        "excerpt": "Brief description (150 chars max)",
        "content": "Full HTML content with proper formatting",
        "tags": ["tag1", "tag2", "tag3"],
        "readingTime": 5
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional content writer for TDC Market, an e-commerce platform. Create engaging, SEO-optimized blog content that helps customers make informed purchasing decisions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    const parsedContent = JSON.parse(content);
    return { success: true, data: parsedContent };
  } catch (error: any) {
    console.error('OpenAI error:', error);
    return { success: false, error: error.message };
  }
};

// AI SEO Optimization
export const optimizeSEO = async (title: string, content: string): Promise<AIResponse> => {
  try {
    const contentPreview = content.substring(0, 1000);
    const prompt = `
      Optimize the following content for SEO:
      
      Title: "${title}"
      Content: "${contentPreview}..."
      
      Provide:
      1. An optimized title (60 chars max)
      2. A meta description (160 chars max)
      3. 5-7 relevant keywords
      4. Suggestions for internal linking
      5. Alt text suggestions for images
      
      Format as JSON:
      {
        "optimizedTitle": "...",
        "metaDescription": "...",
        "keywords": ["keyword1", "keyword2"],
        "internalLinks": ["/collections/figures", "/blog/guide"],
        "imageAltTexts": ["alt text 1", "alt text 2"]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an SEO expert specializing in e-commerce content optimization."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No SEO optimization generated');
    }

    const parsedContent = JSON.parse(responseContent);
    return { success: true, data: parsedContent };
  } catch (error: any) {
    console.error('OpenAI SEO error:', error);
    return { success: false, error: error.message };
  }
};

// AI Price Suggestion
export const suggestPrice = async (productName: string, category: string, cost: number): Promise<AIResponse> => {
  try {
    const prompt = `
      Suggest pricing for a product in the Turkish market:
      
      Product: "${productName}"
      Category: "${category}"
      Cost: ₺${cost}
      
      Consider:
      - Market competition
      - Product quality and uniqueness
      - Target customer segment
      - Seasonal trends
      - Profit margins (aim for 30-50%)
      
      Provide:
      1. Minimum price (break-even + small profit)
      2. Recommended price (optimal profit)
      3. Premium price (high-end positioning)
      4. Reasoning for each price point
      5. Competitive analysis
      
      Format as JSON:
      {
        "minPrice": 100,
        "recommendedPrice": 150,
        "premiumPrice": 200,
        "reasoning": {
          "minPrice": "Break-even analysis...",
          "recommendedPrice": "Market positioning...",
          "premiumPrice": "Premium positioning..."
        },
        "competitorAnalysis": "Analysis of similar products...",
        "confidence": 0.85
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a pricing expert for e-commerce platforms, specializing in the Turkish market. Provide data-driven pricing recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No pricing suggestion generated');
    }

    const parsedContent = JSON.parse(responseContent);
    return { success: true, data: parsedContent };
  } catch (error: any) {
    console.error('OpenAI pricing error:', error);
    return { success: false, error: error.message };
  }
};

// AI Content Moderation
export const moderateContent = async (content: string): Promise<AIResponse> => {
  try {
    const prompt = `
      Moderate the following content for TDC Market blog:
      
      Content: "${content}"
      
      Check for:
      1. Inappropriate language
      2. Hate speech
      3. Personal information exposure
      4. Spam indicators
      5. Copyright violations
      6. Misleading information
      
      Provide moderation decision and reasoning.
      
      Format as JSON:
      {
        "approved": true/false,
        "confidence": 0.95,
        "issues": ["issue1", "issue2"],
        "reasoning": "Detailed explanation...",
        "suggestions": ["suggestion1", "suggestion2"]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a content moderator for TDC Market. Ensure all content meets community guidelines and is appropriate for all audiences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No moderation result generated');
    }

    const parsedContent = JSON.parse(responseContent);
    return { success: true, data: parsedContent };
  } catch (error: any) {
    console.error('OpenAI moderation error:', error);
    return { success: false, error: error.message };
  }
};

// AI Keyword Research
export const researchKeywords = async (seedKeyword: string): Promise<AIResponse> => {
  try {
    const prompt = `
      Research keywords for "${seedKeyword}" in the Turkish e-commerce market:
      
      Provide:
      1. Primary keywords (high volume, high competition)
      2. Long-tail keywords (lower volume, lower competition)
      3. Related keywords
      4. Seasonal keywords
      5. Local keywords (Turkey-specific)
      6. Search volume estimates
      7. Competition level
      8. Content suggestions
      
      Format as JSON:
      {
        "primaryKeywords": [
          {"keyword": "keyword1", "volume": "high", "competition": "high", "difficulty": 8}
        ],
        "longTailKeywords": [
          {"keyword": "long tail keyword", "volume": "medium", "competition": "low", "difficulty": 3}
        ],
        "relatedKeywords": ["related1", "related2"],
        "seasonalKeywords": ["seasonal1", "seasonal2"],
        "localKeywords": ["local1", "local2"],
        "contentSuggestions": ["suggestion1", "suggestion2"]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a keyword research expert specializing in Turkish e-commerce and content marketing."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No keyword research generated');
    }

    const parsedContent = JSON.parse(responseContent);
    return { success: true, data: parsedContent };
  } catch (error: any) {
    console.error('OpenAI keyword research error:', error);
    return { success: false, error: error.message };
  }
};