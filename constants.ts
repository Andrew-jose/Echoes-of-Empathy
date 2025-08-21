import { Topic, ReactionType, EmotionTag, Story } from './types';

export const TOPICS: Topic[] = [
  Topic.ANXIETY,
  Topic.ACADEMIC_STRESS,
  Topic.BREAKUPS,
  Topic.BULLYING,
  Topic.GENDER_IDENTITY,
  Topic.PARENTAL_PRESSURE,
  Topic.HEALING,
  Topic.LONELINESS,
  Topic.GENERAL
];

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  [ReactionType.RELATE]: '🤝',
  [ReactionType.LOVE]: '❤️',
  [ReactionType.BEEN_THERE]: '🫂',
};

export const EMOTION_TAG_STYLES: Record<EmotionTag, string> = {
  [EmotionTag.ANXIETY]: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  [EmotionTag.LONELINESS]: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  [EmotionTag.HOPE]: 'bg-green-500/20 text-green-300 border-green-500/30',
  [EmotionTag.HEARTBREAK]: 'bg-red-500/20 text-red-300 border-red-500/30',
  [EmotionTag.STRESS]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  [EmotionTag.HEALING]: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  [EmotionTag.COURAGE]: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  [EmotionTag.SADNESS]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [EmotionTag.RELIEF]: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
};

export const INITIAL_STORIES: Story[] = [
    {
        id: '1',
        alias: 'Wanderer',
        topic: Topic.ANXIETY,
        content: "The weight of my classes is crushing me. Every exam feels like a verdict on my future, and I can't seem to catch my breath. It's a constant battle between wanting to succeed and feeling paralyzed by the fear of failure. Sometimes, I just stare at my books, and the words blur into an incomprehensible mess. It's isolating because everyone else seems to be handling it so well. I just want to feel normal again, to enjoy learning without this suffocating pressure.",
        tags: [EmotionTag.ANXIETY, EmotionTag.STRESS, EmotionTag.LONELINESS],
        reactions: {
            [ReactionType.RELATE]: 12,
            [ReactionType.LOVE]: 25,
            [ReactionType.BEEN_THERE]: 18,
        },
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
    },
    {
        id: '2',
        alias: 'Stargazer',
        topic: Topic.HEALING,
        content: "After the breakup, I felt like a city in ruins. But slowly, piece by piece, I started rebuilding. I started painting again, something I hadn't done in years. I went for long walks just to watch the sunset. It wasn't a magical, overnight fix. It was slow, painful, and often lonely. But today, for the first time, I looked in the mirror and recognized the person staring back. I saw a survivor, not a victim. There's a quiet strength in healing, a gentle hope that whispers, 'you're going to be okay.'",
        tags: [EmotionTag.HEALING, EmotionTag.HOPE, EmotionTag.RELIEF],
        reactions: {
            [ReactionType.RELATE]: 30,
            [ReactionType.LOVE]: 54,
            [ReactionType.BEEN_THERE]: 22,
        },
        timestamp: Date.now() - 1000 * 60 * 60 * 24,
    },
];