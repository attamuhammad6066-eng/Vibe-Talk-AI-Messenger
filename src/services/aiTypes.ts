export type SupportedLanguage =
  | 'English'
  | 'Urdu'
  | 'Roman Urdu'
  | 'Punjabi'
  | 'Arabic'
  | 'Spanish'
  | 'French'
  | 'German'
  | 'Italian'
  | 'Chinese'
  | 'Japanese';

export const SUPPORTED_LANGUAGES: { id: SupportedLanguage; label: string; native: string; flag: string }[] = [
  { id: 'English', label: 'English', native: 'English', flag: '🇺🇸' },
  { id: 'Urdu', label: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { id: 'Roman Urdu', label: 'Roman Urdu', native: 'Roman Urdu', flag: '💬' },
  { id: 'Punjabi', label: 'Punjabi', native: 'ਪੰਜਾਬੀ / پنجابی', flag: '🌾' },
  { id: 'Arabic', label: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { id: 'Spanish', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { id: 'French', label: 'French', native: 'Français', flag: '🇫🇷' },
  { id: 'German', label: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { id: 'Italian', label: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { id: 'Chinese', label: 'Chinese', native: '中文', flag: '🇨🇳' },
  { id: 'Japanese', label: 'Japanese', native: '日本語', flag: '🇯🇵' },
];

export type AIAssistantMode =
  | 'general'
  | 'writing'
  | 'planning'
  | 'translation'
  | 'summary';

export type AIMessageAction =
  | 'rewrite'
  | 'grammar'
  | 'professional'
  | 'friendly'
  | 'casual'
  | 'short'
  | 'detailed'
  | 'translate'
  | 'explain'
  | 'summarize'
  | 'generate_reply'
  | 'generate_email'
  | 'generate_announcement';

export interface AIMessageActionMeta {
  id: AIMessageAction;
  label: string;
  category: 'style' | 'grammar' | 'transform' | 'generate';
  icon: string;
  description: string;
}

export const AI_MESSAGE_ACTIONS: AIMessageActionMeta[] = [
  { id: 'rewrite', label: 'Rewrite', category: 'style', icon: 'Sparkles', description: 'Rephrase cleanly and naturally' },
  { id: 'grammar', label: 'Grammar & Polish', category: 'grammar', icon: 'CheckCheck', description: 'Fix spelling, grammar & punctuation' },
  { id: 'professional', label: 'Professional', category: 'style', icon: 'Briefcase', description: 'Formal, polite business tone' },
  { id: 'friendly', label: 'Friendly', category: 'style', icon: 'Smile', description: 'Warm, empathetic and cheerful' },
  { id: 'casual', label: 'Casual', category: 'style', icon: 'Coffee', description: 'Relaxed modern chat style' },
  { id: 'short', label: 'Short & Punchy', category: 'transform', icon: 'Scissors', description: 'Concise summary version' },
  { id: 'detailed', label: 'Detailed & Expand', category: 'transform', icon: 'Maximize2', description: 'Elaborate with examples' },
  { id: 'translate', label: 'Translate', category: 'transform', icon: 'Globe', description: 'Translate to any of 11 languages' },
  { id: 'explain', label: 'Explain Simply', category: 'transform', icon: 'HelpCircle', description: 'Break down complex thoughts' },
  { id: 'summarize', label: 'Summarize', category: 'transform', icon: 'FileText', description: 'Extract bullet points' },
  { id: 'generate_reply', label: 'Generate Reply', category: 'generate', icon: 'MessageSquare', description: 'Contextual smart response' },
  { id: 'generate_email', label: 'Generate Email', category: 'generate', icon: 'Mail', description: 'Format draft into complete email' },
  { id: 'generate_announcement', label: 'Announcement', category: 'generate', icon: 'Megaphone', description: 'Formatted group broadcast' },
];

export type AIVisionTask =
  | 'describe'
  | 'ocr'
  | 'extract'
  | 'translate'
  | 'summary'
  | 'qa';

export interface AIChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  mode?: AIAssistantMode;
  attachment?: {
    type: 'image' | 'document' | 'audio';
    name: string;
    url: string;
    dataBase64?: string;
    mimeType?: string;
  };
}

export interface AIReviewPayload {
  originalText: string;
  generatedText: string;
  action: AIMessageAction;
  targetLang?: SupportedLanguage;
  timestamp: number;
}

// ---------------------------------------------------------------------------
// PHASE 6: MYTONE & ADVANCED AI TYPES
// ---------------------------------------------------------------------------

export type MyToneStyle =
  | 'casual'
  | 'friendly'
  | 'professional'
  | 'funny'
  | 'formal'
  | 'respectful'
  | 'short'
  | 'detailed'
  | 'urdu'
  | 'roman_urdu'
  | 'personal_style';

export interface MyToneMeta {
  id: MyToneStyle;
  label: string;
  description: string;
  icon: string;
  example: string;
}

export const MYTONE_STYLES: MyToneMeta[] = [
  { id: 'casual', label: 'Casual', description: 'Relaxed, modern conversational chat', icon: 'Coffee', example: 'Hey! Sounds awesome, let us sync up later.' },
  { id: 'friendly', label: 'Friendly', description: 'Warm, uplifting and encouraging', icon: 'Smile', example: 'So happy to hear this! Let me know if you need anything at all. 😊' },
  { id: 'professional', label: 'Professional', description: 'Polished, articulate business tone', icon: 'Briefcase', example: 'Thank you for the update. I have reviewed the deliverables and approve.' },
  { id: 'funny', label: 'Funny', description: 'Witty, humorous and playful', icon: 'Laugh', example: 'Well, look who decided to grace us with their presence! 😂' },
  { id: 'formal', label: 'Formal', description: 'Traditional, decorous etiquette', icon: 'Award', example: 'Respected colleague, please accept this formal confirmation of our appointment.' },
  { id: 'respectful', label: 'Respectful', description: 'Humble, polite and considerate', icon: 'Heart', example: 'Thank you kindly for your time and guidance. I deeply appreciate your support.' },
  { id: 'short', label: 'Short', description: 'Ultra-concise, minimum fluff', icon: 'Scissors', example: 'Confirmed. On it.' },
  { id: 'detailed', label: 'Detailed', description: 'Comprehensive and structured breakdown', icon: 'FileText', example: 'Here is the step-by-step review including timelines, risks, and next steps.' },
  { id: 'urdu', label: 'Urdu (اردو)', description: 'Classic refined Urdu phrasing', icon: 'Globe', example: 'بہت شکریہ، آپ کی رہنمائی کا دل سے ممنون ہوں۔' },
  { id: 'roman_urdu', label: 'Roman Urdu', description: 'Colloquial Latin-script Urdu', icon: 'MessageSquare', example: 'Bohat shukriya bhai, kaam ho gaya hai. Kal baat karte hain.' },
  { id: 'personal_style', label: 'Personal Style', description: 'Custom learned profile tailored to you', icon: 'UserCheck', example: 'Custom trained on your actual phrasing habits & vocabulary.' },
];

export interface MyToneProfile {
  enabled: boolean;
  consentGiven: boolean;
  activeTone: MyToneStyle;
  customGuidelines: string;
  signatureSignoff: string;
  learnedVocabulary: string[];
  formalityScore: number; // 1-10
  brevityScore: number; // 1-10
  emojiFrequency: 'none' | 'light' | 'moderate' | 'high';
  lastTrainedAt?: number;
}

export interface DigitalTwinConfig {
  enabled: boolean;
  approvalMode: 'auto_send_with_tag' | 'approval_required';
  workingHours: {
    enabled: boolean;
    start: string; // "09:00"
    end: string; // "18:00"
    days: number[]; // [1,2,3,4,5] (Mon-Fri)
    timezone: string;
  };
  allowedContactIds: string[]; // empty array = all contacts
  allowInGroups: boolean;
  onlyWhenMentionedInGroups: boolean;
  humanHandoffKeywords: string[];
  aiReplyBadgeText: string;
}

export interface DigitalTwinPendingApproval {
  id: string;
  chatId: string;
  chatName: string;
  senderName: string;
  incomingMessage: string;
  suggestedReply: string;
  timestamp: number;
}

export interface RelationshipGuardianResult {
  isHarsh: boolean;
  severity: 'none' | 'mild' | 'moderate' | 'high';
  triggerPhrases: string[];
  reasoning: string;
  suggestions: {
    polite: string;
    friendly: string;
    calm: string;
    professional: string;
  };
}

export interface MoodRingResult {
  moodName: string;
  primaryColor: string;
  secondaryColor: string;
  auraEmoji: string;
  energyLevel: 'calm' | 'moderate' | 'high' | 'playful';
  summary: string;
  disclaimer: string;
}

export interface SmartWhisperSettings {
  enabled: boolean;
  noiseReductionLevel: 'low' | 'balanced' | 'aggressive';
  voiceClarityBoost: boolean;
  windDucking: boolean;
}

export interface LiveCallTranslationState {
  enabled: boolean;
  sourceLang: SupportedLanguage;
  targetLang: SupportedLanguage;
  originalSubtitle: string;
  translatedSubtitle: string;
  isSpeakingAudio: boolean;
  disclaimer: string;
}

export type ScamClassification =
  | 'Likely Human'
  | 'Potentially AI Generated'
  | 'Suspicious'
  | 'Unable to Verify';

export interface ScamBusterVerdict {
  classification: ScamClassification;
  confidence: number;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  verdictSummary: string;
  indicators: string[];
  recommendations: string[];
  mandatoryNotice: string;
}

export interface BusinessProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  currency: string;
  description: string;
  maxAllowedDiscountPct: number;
  inStock: boolean;
}

export interface BusinessFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface BusinessAIConfig {
  enabled: boolean;
  businessName: string;
  welcomeMessage: string;
  maxGlobalDiscountPct: number;
  operatingBoundaries: string;
  products: BusinessProduct[];
  faqs: BusinessFAQ[];
}

