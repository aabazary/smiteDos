'use client';

import { useState } from 'react';
import { SMITE_GODS, getGodNames } from '@/data/gods';

export default function RandomGod() {
    const [selectedGod, setSelectedGod] = useState<string | null>(null);
    const [isRolling, setIsRolling] = useState(false);
    const godNames = getGodNames();

    const rollGod = () => {
        setIsRolling(true);
        let iterations = 0;
        const maxIterations = 20;
        const interval = setInterval(() => {
            const randomGod = godNames[Math.floor(Math.random() * godNames.length)];
            setSelectedGod(randomGod);
            iterations++;
            
            if (iterations >= maxIterations) {
                clearInterval(interval);
                const finalGod = godNames[Math.floor(Math.random() * godNames.length)];
                setSelectedGod(finalGod);
                setIsRolling(false);
            }
        }, 100);
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8">Random God</h1>
            
            <div className="mb-8">
                <button
                    onClick={rollGod}
                    disabled={isRolling}
                    className={`bg-purple-600 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-purple-700 transition-colors
                        ${isRolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isRolling ? 'Rolling...' : 'Roll for a God'}
                </button>
            </div>

            {selectedGod && (
                <div className="text-4xl font-bold text-center mb-8">
                    {selectedGod}
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2">
                {godNames.map((god, index) => (
                    <div
                        key={index}
                        className="bg-white p-2 rounded shadow hover:shadow-md transition-shadow text-center whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                        {god}
                    </div>
                ))}
            </div>
        </div>
    );
} 