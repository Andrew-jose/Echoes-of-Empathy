
import React from 'react';

interface HeaderProps {
    onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
    return (
        <header className="bg-primary/80 backdrop-blur-sm sticky top-0 z-50 border-b border-secondary">
            <div className="container mx-auto px-4 py-3">
                <div 
                    onClick={onHomeClick}
                    className="text-xl md:text-2xl font-bold tracking-wider text-light-text cursor-pointer hover:text-highlight transition-colors"
                >
                    Echoes of Empathy
                </div>
            </div>
        </header>
    );
};

export default Header;
