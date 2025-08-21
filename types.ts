
export enum Topic {
  ANXIETY = 'Anxiety',
  ACADEMIC_STRESS = 'Academic Stress',
  BREAKUPS = 'Breakups',
  BULLYING = 'Bullying',
  GENDER_IDENTITY = 'Gender Identity',
  PARENTAL_PRESSURE = 'Parental Pressure',
  HEALING = 'Healing Journey',
  LONELINESS = 'Loneliness',
  GENERAL = 'General',
}

export enum EmotionTag {
  ANXIETY = 'Anxiety',
  LONELINESS = 'Loneliness',
  HOPE = 'Hope',
  HEARTBREAK = 'Heartbreak',
  STRESS = 'School Stress',
  HEALING = 'Healing Journey',
  COURAGE = 'Courage',
  SADNESS = 'Sadness',
  RELIEF = 'Relief',
}

export enum ReactionType {
  RELATE = 'I relate',
  LOVE = 'Sending love',
  BEEN_THERE = 'Been there too',
}

export enum CommentTone {
  COMFORTING = 'Comforting',
  MOTIVATIONAL = 'Motivational',
  REFLECTIVE = 'Reflective',
}

export interface Story {
  id: string;
  alias: string;
  topic: Topic;
  content: string;
  tags: EmotionTag[];
  reactions: Record<ReactionType, number>;
  timestamp: number;
}

export interface ModerationResult {
  isSafe: boolean;
  reason?: string;
}

export type View = { type: 'home' } | { type: 'submit' } | { type: 'story'; storyId: string };
