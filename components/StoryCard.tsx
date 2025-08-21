import React from 'react';
import { Story, ReactionType } from '../types';
import { REACTION_EMOJIS, EMOTION_TAG_STYLES } from '../constants';

interface StoryCardProps {
    story: Story;
    onClick: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
    
    const contentSnippet = story.content.length > 150 
        ? `${story.content.substring(0, 150)}...` 
        : story.content;
    
    return (
        <div 
            onClick={onClick}
            className="bg-secondary rounded-lg shadow-lg p-6 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:border-highlight border-2 border-transparent transition-all duration-300 transform hover:-translate-y-1"
            role="article"
            aria-labelledby={`story-title-${story.id}`}
        >
            <div>
                <div className="flex justify-between items-start mb-3">
                    <h2 id={`story-title-${story.id}`} className="text-lg font-bold text-highlight">{story.topic}</h2>
                    <span className="text-xs text-muted-text flex-shrink-0 ml-2">by {story.alias}</span>
                </div>

                <p className="text-sm text-light-text mb-4 h-20 overflow-hidden">
                    {contentSnippet}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                    {story.tags.slice(0, 3).map(tag => (
                        <span key={tag} className={`text-xs font-medium px-2 py-0.5 rounded-full border ${EMOTION_TAG_STYLES[tag]}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="border-t border-accent pt-3 flex items-center justify-end gap-4">
                {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => (
                    <div key={type} className="flex items-center text-sm text-muted-text">
                        <span className="mr-1.5 text-lg">{emoji}</span>
                        <span>{story.reactions[type as ReactionType]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoryCard;
