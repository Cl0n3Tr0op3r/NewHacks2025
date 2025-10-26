import React, { useState } from 'react';
import { getTopicSummary, RedditSummary } from '../services/geminiService';

const examples = ["r/futurology", "r/askscience", "r/explainlikeimfive", "r/gadgets", "r/personalfinance", "r/travel"];

// Helper function to determine badge color based on score
const getScoreColor = (score: number) => {
    if (score <= 3) return 'bg-green-100 text-green-800 border-green-300';
    if (score <= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
};

// Helper function to get emoji based on score
const getScoreEmoji = (score: number) => {
    if (score > 6) return '🌧️'; // rainy
    if (score >= 4) return '☁️'; // cloudy
    return '☀️'; // sunny
};

export const SubredditSummarizer: React.FC = () => {
    const [subredditName, setSubredditName] = useState('');
    const [summaryData, setSummaryData] = useState<RedditSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSummarize = async (e: React.FormEvent) => {
        e.preventDefault();
        const topic = subredditName.trim();
        if (!topic) {
            setError('Please enter a subreddit name.');
            return;
        }
        if (topic.includes('/comments/')) {
            setError('Please use the section above for post URLs. This is for subreddits only.');
            return;
        }

        setError('');
        setSummaryData(null);
        setIsLoading(true);

        const result = await getTopicSummary(topic);

        if (result.summary.startsWith('Error:')) {
            setError(result.summary);
            setSummaryData(null);
        } else {
            const formattedSummary = result.summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');
            setSummaryData({ ...result, summary: formattedSummary });
        }

        setIsLoading(false);
    };

    return (
        <section id="subreddit-summarizer" className="py-20 bg-slate-100 border-y border-slate-200">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                    Or, Explore a Subreddit
                </h2>
                <p className="mt-4 mb-8 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                    Curious about a community? Get a quick overview of its purpose, topics, and general vibe.
                </p>

                <form onSubmit={handleSummarize} className="max-w-2xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-xl border border-slate-200 shadow-md">
                        <input
                            type="text"
                            value={subredditName}
                            onChange={(e) => setSubredditName(e.target.value)}
                            placeholder="Enter a subreddit name, e.g., r/technology"
                            className="flex-grow bg-transparent text-slate-800 placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Summarizing...
                                </>
                            ) : "Summarize Subreddit"}
                        </button>
                    </div>
                </form>
                {error && <p className="mt-4 text-red-600 bg-red-100 px-4 py-2 rounded-md inline-block">{error}</p>}
                
                {summaryData && !error && (
                    <div className="mt-8 max-w-3xl mx-auto animate-fade-in">
                        <div className="p-6 bg-white border border-slate-200 rounded-xl text-left shadow-lg">
                            {summaryData.sensitivityScore && (
                                <div className="flex items-center gap-3 mb-4">
                                    <h3 className="text-lg font-bold text-slate-900">Community Vibe:</h3>
                                    <span className={`px-3 py-1 text-base font-bold rounded-full border ${getScoreColor(summaryData.sensitivityScore)}`}>
                                        {getScoreEmoji(summaryData.sensitivityScore)} {summaryData.sensitivityScore} / 10
                                    </span>
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Subreddit Summary:</h3>
                            <div className="text-slate-700 leading-relaxed max-h-60 overflow-y-auto" dangerouslySetInnerHTML={{ __html: summaryData.summary }} />
                        </div>

                        {summaryData.sensitivityScore && (
                            <div className="mt-4 p-4 text-sm sm:text-base bg-white border border-slate-200 rounded-lg text-slate-800 shadow-lg">
                                {summaryData.sensitivityScore < 4 && (
                                    <p>☀️ This community seems friendly and constructive! You can <a href={`https://www.reddit.com/${subredditName.trim()}`} target="_blank" rel="noopener noreferrer" className="font-bold underline text-orange-600 hover:text-orange-700 transition-colors">visit the subreddit here</a>.</p>
                                )}
                                {summaryData.sensitivityScore >= 4 && summaryData.sensitivityScore <= 6 && (
                                    <p>☁️ This community has mixed discussions. It might be better to seek another one if you're looking for a purely positive space.</p>
                                )}
                                {summaryData.sensitivityScore > 6 && (
                                    <div>
                                        <p className="font-bold mb-2">🌧️ This community seems pretty heated. How about exploring these calmer subreddits instead?</p>
                                        <ul className="flex flex-wrap gap-2 justify-center">
                                            {examples.slice(0, 3).map(ex => (
                                                <li key={ex}><span className="bg-slate-200 px-3 py-1 rounded-full text-xs sm:text-sm text-slate-700">{ex}</span></li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};