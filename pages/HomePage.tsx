import React, { useState } from 'react';
import { Story, View, Topic } from '../types';
import StoryCard from '../components/StoryCard';
import { TOPICS } from '../constants';

interface HomePageProps {
    stories: Story[];
    setView: (view: View) => void;
}

const HomePage: React.FC<HomePageProps> = ({ stories, setView }) => {
    const [filter, setFilter] = useState<Topic | 'All'>('All');
    
    const filteredStories = filter === 'All' ? stories : stories.filter(story => story.topic === filter);

    return (
        <div className="animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                 <h1 className="text-3xl font-bold text-light-text">Read Stories</h1>
                 <button
                    onClick={() => setView({ type: 'submit' })}
                    className="w-full md:w-auto bg-highlight text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-red-500 transition-all duration-300 transform hover:scale-105"
                >
                    Share Your Story
                </button>
            </div>

            <div className="mb-6">
                <label htmlFor="topic-filter" className="block text-sm font-medium text-muted-text mb-2">Filter by Topic:</label>
                <select 
                    id="topic-filter" 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as Topic | 'All')}
                    className="bg-secondary border border-accent text-light-text text-sm rounded-lg focus:ring-highlight focus:border-highlight block w-full p-2.5"
                >
                    <option value="All">All Topics</option>
                    {TOPICS.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                    ))}
                </select>
            </div>
            
            {filteredStories.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStories.map(story => (
                        <StoryCard key={story.id} story={story} onClick={() => setView({ type: 'story', storyId: story.id })} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-secondary rounded-lg">
                    <p className="text-muted-text text-lg">No stories found for "{filter}".</p>
                    <p className="text-sm text-gray-500 mt-2">Why not be the first to share one?</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;
