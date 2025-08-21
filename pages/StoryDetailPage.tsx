import React, { useState, useEffect } from 'react';
import { Story, ReactionType, CommentTone } from '../types';
import { REACTION_EMOJIS, EMOTION_TAG_STYLES } from '../constants';
import { generateSupportComment } from '../services/geminiService';
import Spinner from '../components/Spinner';

interface StoryDetailPageProps {
    story: Story;
    onBack: () => void;
}

const StoryDetailPage: React.FC<StoryDetailPageProps> = ({ story: initialStory, onBack }) => {
    const [story, setStory] = useState(initialStory);
    const [aiComment, setAiComment] = useState<string | null>(null);
    const [isGeneratingComment, setIsGeneratingComment] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        // Cleanup speech synthesis on component unmount
        return () => {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
        };
    }, []);


    const handleReaction = (reaction: ReactionType) => {
        // In a real app, this would be a debounced API call.
        // Here we simulate it locally.
        setStory(prevStory => ({
            ...prevStory,
            reactions: {
                ...prevStory.reactions,
                [reaction]: prevStory.reactions[reaction] + 1
            }
        }));
    };

    const handleGenerateComment = async (tone: CommentTone) => {
        setCommentError(null);
        setIsGeneratingComment(true);
        setAiComment(null);
        try {
            const comment = await generateSupportComment(story.content, tone);
            setAiComment(comment);
        } catch (error) {
            setCommentError("Failed to generate a comment. Please try again.");
        } finally {
            setIsGeneratingComment(false);
        }
    };
    
    const handleAudioMode = () => {
        if (isSpeaking) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(`${story.topic}. A story by ${story.alias}. ${story.content}`);
            const voices = speechSynthesis.getVoices();
            // Try to find an Indian English voice
            const indianVoice = voices.find(voice => voice.lang === 'en-IN');
            if (indianVoice) {
                utterance.voice = indianVoice;
            } else {
                 // Fallback to a default English voice
                utterance.voice = voices.find(voice => voice.lang.startsWith('en-')) || voices[0];
            }
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        } else {
            alert("Sorry, your browser doesn't support text-to-speech.");
        }
    };

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        let interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "Just now";
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <button onClick={onBack} className="text-highlight mb-4 hover:underline">&larr; Back to all stories</button>
            <article className="bg-secondary p-6 md:p-8 rounded-lg shadow-xl">
                <header className="border-b border-accent pb-4 mb-6">
                    <div className="flex justify-between items-center mb-2 flex-wrap">
                         <span className="text-lg font-bold text-highlight">{story.topic}</span>
                         <span className="text-sm text-muted-text">Posted by {story.alias} &bull; {timeAgo(story.timestamp)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {story.tags.map(tag => (
                            <span key={tag} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${EMOTION_TAG_STYLES[tag]}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </header>
                
                <div className="prose prose-invert max-w-none text-light-text text-lg leading-relaxed whitespace-pre-wrap font-light">
                    <p>{story.content}</p>
                </div>

                <footer className="mt-8 border-t border-accent pt-6 space-y-8">
                    {/* Reactions */}
                    <div>
                        <p className="text-sm font-semibold text-muted-text mb-3">Show your support:</p>
                        <div className="flex items-center gap-3 flex-wrap">
                            {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => (
                                <button
                                    key={type}
                                    onClick={() => handleReaction(type as ReactionType)}
                                    className="flex items-center gap-2 bg-accent/50 hover:bg-accent px-4 py-2 rounded-full transition-colors text-light-text"
                                    aria-label={`React with ${type}`}
                                >
                                    <span className="text-xl">{emoji}</span>
                                    <span>{story.reactions[type as ReactionType]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Audio Mode */}
                    <div>
                        <h3 className="text-sm font-semibold text-muted-text mb-3">Audio Mode</h3>
                         <button 
                            onClick={handleAudioMode}
                            className="flex items-center gap-2 bg-accent/50 hover:bg-accent px-4 py-2 rounded-full transition-colors text-light-text"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d={isSpeaking ? "M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" : "M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5 5 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"} />
                            </svg>
                            <span>{isSpeaking ? 'Stop Reading' : 'Read Aloud'}</span>
                        </button>
                    </div>

                    {/* AI-Generated Support Comment */}
                    <div>
                        <h3 className="text-sm font-semibold text-muted-text mb-3">Need a kind word?</h3>
                        <p className="text-sm text-muted-text mb-4">Request a gentle comment from our AI companion. Choose a tone that feels right for you.</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {Object.values(CommentTone).map(tone => (
                                <button
                                    key={tone}
                                    onClick={() => handleGenerateComment(tone)}
                                    disabled={isGeneratingComment}
                                    className="text-xs bg-accent/50 hover:bg-accent px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {tone}
                                </button>
                            ))}
                        </div>

                        {isGeneratingComment && (
                            <div className="flex items-center gap-2 text-muted-text p-4 bg-primary rounded-lg">
                                <Spinner size="5"/>
                                <span>Generating a supportive comment...</span>
                            </div>
                        )}

                        {commentError && <p className="text-red-400 text-sm p-4 bg-red-500/10 rounded-lg">{commentError}</p>}
                        
                        {aiComment && (
                            <div className="p-4 bg-primary rounded-lg border border-accent animate-fade-in">
                                <p className="text-light-text italic">"{aiComment}"</p>
                                <p className="text-xs text-muted-text mt-2 text-right">- AI Companion</p>
                            </div>
                        )}
                    </div>
                </footer>
            </article>
        </div>
    );
};

export default StoryDetailPage;
