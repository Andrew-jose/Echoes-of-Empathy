import React, { useState } from 'react';
import { Topic, Story } from '../types';
import { TOPICS } from '../constants';
import { moderateStory, tagStory } from '../services/geminiService';
import Spinner from '../components/Spinner';

interface SubmitStoryPageProps {
    onSubmit: (story: Story) => void;
    onBack: () => void;
}

const SubmitStoryPage: React.FC<SubmitStoryPageProps> = ({ onSubmit, onBack }) => {
    const [alias, setAlias] = useState('');
    const [topic, setTopic] = useState<Topic>(Topic.GENERAL);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim().length < 150) {
            setError('Story must be at least 150 characters long.');
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            setLoadingMessage('Checking story for safety...');
            await new Promise(res => setTimeout(res, 500)); // Simulate network delay
            const moderationResult = await moderateStory(content);
            if (!moderationResult.isSafe) {
                setError(`This story cannot be published. Reason: ${moderationResult.reason}`);
                setIsLoading(false);
                return;
            }

            setLoadingMessage('Analyzing emotions...');
            await new Promise(res => setTimeout(res, 500));
            const tags = await tagStory(content);

            const newStory: Story = {
                id: crypto.randomUUID(),
                alias: alias.trim() || 'Anonymous',
                topic,
                content: content.trim(),
                tags,
                reactions: { 'I relate': 0, 'Sending love': 0, 'Been there too': 0 },
                timestamp: Date.now(),
            };
            
            setLoadingMessage('Finalizing...');
            await new Promise(res => setTimeout(res, 500));
            onSubmit(newStory);

        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-secondary p-8 rounded-lg shadow-xl animate-fade-in">
            <button onClick={onBack} className="text-highlight mb-4 hover:underline">&larr; Back to stories</button>
            <h1 className="text-3xl font-bold text-light-text mb-6">Share Your Story</h1>
            <p className="text-muted-text mb-6">Your story is safe here. Share anonymously and connect with a community that understands. All submissions are checked by AI to ensure a supportive environment.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="alias" className="block text-sm font-medium text-light-text mb-2">Alias (Optional)</label>
                    <input 
                        type="text" 
                        id="alias" 
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        placeholder="e.g., Stargazer"
                        className="bg-primary border border-accent text-light-text text-sm rounded-lg focus:ring-highlight focus:border-highlight block w-full p-2.5"
                    />
                </div>
                 <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-light-text mb-2">Choose a Topic</label>
                    <select 
                        id="topic" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value as Topic)}
                        className="bg-primary border border-accent text-light-text text-sm rounded-lg focus:ring-highlight focus:border-highlight block w-full p-2.5"
                    >
                        {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-light-text mb-2">Your Story (min. 150 characters)</label>
                    <textarea 
                        id="content" 
                        rows={10}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="bg-primary border border-accent text-light-text text-sm rounded-lg focus:ring-highlight focus:border-highlight block w-full p-2.5"
                        placeholder="Share what's on your mind..."
                        required
                        minLength={150}
                    />
                </div>
                
                {error && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">{error}</p>}
                
                <div>
                    <button 
                        type="submit" 
                        disabled={isLoading || content.trim().length < 150}
                        className="w-full bg-highlight text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-red-500 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? <><Spinner size="6" /> <span className="ml-2">{loadingMessage}</span></> : 'Submit Anonymously'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SubmitStoryPage;