/**
 * Conversation Types for Plan Chat
 *
 * These types support multi-turn conversations with image uploads
 * for the conversational plan creation feature.
 */

// Claude Vision API content block types
export interface TextContent {
  type: 'text';
  text: string;
}

export interface ImageSource {
  type: 'base64';
  media_type: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
  data: string;
}

export interface ImageContent {
  type: 'image';
  source: ImageSource;
}

export type ContentBlock = TextContent | ImageContent;

// Message format for conversation history
export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string | ContentBlock[];
}

// Request format from iOS
export interface PlanChatRequest {
  messages: PlanChatMessageDTO[];
  userId: string;
}

export interface PlanChatMessageDTO {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  imageData?: string; // Base64 encoded image
  planPreview?: GeneratedPlanPreview; // Embedded plan preview (assistant messages)
  suggestsActivation?: boolean; // Whether the AI suggests activating the plan
}

// Response format to iOS
export interface PlanChatResponse {
  success: boolean;
  message: PlanChatMessageDTO;
  planPreview?: GeneratedPlanPreview;
  suggestsActivation: boolean;
  error?: string;
}

// Generated plan structure (matches iOS model)
export interface GeneratedPlanPreview {
  name: string;
  description: string;
  daysPerWeek: number;
  goal: string;
  days: GeneratedPlanDay[];
}

export interface GeneratedPlanDay {
  dayNumber: number;
  name: string;
  exercises: GeneratedPlanExercise[];
}

export interface GeneratedPlanExercise {
  name: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  notes?: string;
}

// Internal response from agent
export interface PlannerConversationResult {
  text: string;
  plan?: GeneratedPlanPreview;
  suggestsActivation: boolean;
}
