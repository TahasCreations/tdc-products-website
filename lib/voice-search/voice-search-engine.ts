/**
 * Voice Search Engine
 * Speech recognition with natural language processing
 */

export interface VoiceSearchResult {
  transcript: string;
  confidence: number;
  intent: string;
  entities: Record<string, any>;
  query: string;
}

class VoiceSearchEngine {
  private recognition: any = null;
  private isListening = false;

  /**
   * Check if speech recognition is supported
   */
  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  }

  /**
   * Initialize speech recognition
   */
  private init() {
    if (!this.isSupported()) return null;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();

    // Configuration
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'tr-TR'; // Turkish
    this.recognition.maxAlternatives = 1;

    return this.recognition;
  }

  /**
   * Start listening
   */
  async startListening(
    onResult: (result: VoiceSearchResult) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    if (!this.isSupported()) {
      onError?.('Voice search not supported');
      return;
    }

    if (!this.recognition) {
      this.init();
    }

    if (this.isListening) {
      this.stopListening();
      return;
    }

    this.isListening = true;

    this.recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;

      console.log('🎤 Voice input:', transcript, `(${Math.round(confidence * 100)}%)`);

      // Process with NLP
      const result = await this.processTranscript(transcript, confidence);
      onResult(result);
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      onError?.(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      this.isListening = false;
      onError?.('Failed to start voice recognition');
    }
  }

  /**
   * Stop listening
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Process transcript with NLP
   */
  private async processTranscript(
    transcript: string,
    confidence: number
  ): Promise<VoiceSearchResult> {
    const normalized = transcript.toLowerCase().trim();

    // Detect intent
    const intent = this.detectIntent(normalized);

    // Extract entities
    const entities = this.extractEntities(normalized);

    // Build search query
    const query = this.buildSearchQuery(normalized, intent, entities);

    return {
      transcript,
      confidence,
      intent,
      entities,
      query
    };
  }

  /**
   * Detect user intent
   */
  private detectIntent(text: string): string {
    const intents = [
      { keywords: ['ara', 'bul', 'göster'], intent: 'search' },
      { keywords: ['sepet', 'sepete ekle', 'al'], intent: 'add_to_cart' },
      { keywords: ['fiyat', 'ne kadar', 'kaça'], intent: 'price_query' },
      { keywords: ['indirim', 'kampanya', 'teklif'], intent: 'deals' },
      { keywords: ['kategori', 'tür', 'çeşit'], intent: 'category' },
      { keywords: ['sipariş', 'kargo', 'takip'], intent: 'order_status' },
      { keywords: ['yardım', 'destek', 'soru'], intent: 'help' }
    ];

    for (const { keywords, intent } of intents) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return intent;
      }
    }

    return 'search'; // Default
  }

  /**
   * Extract entities (product names, categories, etc.)
   */
  private extractEntities(text: string): Record<string, any> {
    const entities: Record<string, any> = {};

    // Categories
    const categories = ['figür', 'anime', 'manga', 'oyuncak', 'elektronik', 'kitap', 'giyim'];
    for (const category of categories) {
      if (text.includes(category)) {
        entities.category = category;
        break;
      }
    }

    // Brands
    const brands = ['naruto', 'one piece', 'pokemon', 'marvel', 'dc'];
    for (const brand of brands) {
      if (text.includes(brand)) {
        entities.brand = brand;
        break;
      }
    }

    // Price range
    const priceMatch = text.match(/(\d+)\s*(lira|tl|₺)/i);
    if (priceMatch) {
      entities.maxPrice = parseInt(priceMatch[1]);
    }

    // Color
    const colors = ['kırmızı', 'mavi', 'siyah', 'beyaz', 'yeşil', 'sarı'];
    for (const color of colors) {
      if (text.includes(color)) {
        entities.color = color;
        break;
      }
    }

    return entities;
  }

  /**
   * Build search query from transcript
   */
  private buildSearchQuery(
    text: string,
    intent: string,
    entities: Record<string, any>
  ): string {
    // Remove command words
    let query = text
      .replace(/ara|bul|göster|görmek istiyorum/gi, '')
      .trim();

    // Add entity filters
    if (entities.category) {
      query = `${entities.category} ${query}`;
    }

    if (entities.brand) {
      query = `${entities.brand} ${query}`;
    }

    return query || text;
  }

  /**
   * Synthesize speech (text-to-speech)
   */
  speak(text: string, options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  }): void {
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || 'tr-TR';
    utterance.rate = options?.rate || 1;
    utterance.pitch = options?.pitch || 1;
    utterance.volume = options?.volume || 1;

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Cancel speech synthesis
   */
  stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

// Singleton instance
export const voiceSearch = new VoiceSearchEngine();

// React Hook
export function useVoiceSearch() {
  return {
    isSupported: voiceSearch.isSupported(),
    startListening: voiceSearch.startListening.bind(voiceSearch),
    stopListening: voiceSearch.stopListening.bind(voiceSearch),
    speak: voiceSearch.speak.bind(voiceSearch),
    stopSpeaking: voiceSearch.stopSpeaking.bind(voiceSearch)
  };
}

