import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import SubmitStoryPage from './pages/SubmitStoryPage';
import StoryDetailPage from './pages/StoryDetailPage';
import { View, Story } from './types';
import { INITIAL_STORIES } from './constants';

const App: React.FC = () => {
    const [view, setView] = useState<View>({ type: 'home' });
    const [stories, setStories] = useState<Story[]>(INITIAL_STORIES.sort((a, b) => b.timestamp - a.timestamp));

    const addStory = (story: Story) => {
        setStories(prevStories => [story, ...prevStories]);
        navigateTo({ type: 'story', storyId: story.id }); // Navigate to the new story
    };

    const navigateTo = (newView: View) => {
        window.scrollTo(0, 0);
        setView(newView);
    };

    const renderContent = () => {
        switch (view.type) {
            case 'submit':
                return <SubmitStoryPage onSubmit={addStory} onBack={() => navigateTo({ type: 'home' })} />;
            case 'story':
                const story = stories.find(s => s.id === view.storyId);
                // If story not found (e.g., bad ID), redirect to home
                if (!story) {
                    return <HomePage stories={stories} setView={navigateTo} />;
                }
                return <StoryDetailPage story={story} onBack={() => navigateTo({ type: 'home' })} />;
            case 'home':
            default:
                return <HomePage stories={stories} setView={navigateTo} />;
        }
    };

    return (
        <div className="min-h-screen bg-primary font-sans">
            <Header onHomeClick={() => navigateTo({ type: 'home' })} />
            <main className="container mx-auto px-4 py-8">
                {renderContent()}
            </main>
            <footer className="text-center py-4 text-muted-text text-sm">
                <p>Built with empathy for the community.</p>
            </footer>
        </div>
    );
};

export default App;
