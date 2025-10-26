import React, { useState, useEffect } from 'react';
import { getTopicSummary, RedditSummary } from '../services/geminiService';

const examples = ["r/futurology", "r/askscience", "r/explainlikeimfive", "r/gadgets", "r/personalfinance", "r/travel"];

// Helper function to determine badge color based on score
const getScoreColor = (score: number) => {
    if (score <= 3) return 'bg-green-100 text-green-800 border-green-300';
    if (score <= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
};

export const Hero: React.FC = () => {
  const [subredditUrl, setSubredditUrl] = useState('');
  const [summaryData, setSummaryData] = useState<RedditSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('animate-fade-in-up');

  useEffect(() => {
    const interval = setInterval(() => {
        setAnimationClass('animate-fade-out-down');
        setTimeout(() => {
            setExampleIndex((prevIndex) => (prevIndex + 1) % examples.length);
            setAnimationClass('animate-fade-in-up');
        }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  const handleSummarize = async (e: React.FormEvent) => {
    e.preventDefault();
    const topic = subredditUrl.trim();
    if (!topic) {
      setError('Please enter a subreddit name or post URL.');
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
    <section className="relative text-center min-h-[700px] flex items-center justify-center -mt-[80px] pt-[80px]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <video autoPlay loop muted playsInline className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover">
            <source src="https://videos.pexels.com/video-files/3129957/3129957-hd_1920_1080_25fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
      </div>

      <div className="relative z-20 container mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight shadow-lg">
          Reddit, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">filtered.</span>
        </h1>
        <p className="mt-6 mb-12 text-lg md:text-xl text-slate-200 max-w-3xl mx-auto">
          Get the gist of any community or post, minus the noise. AI summaries help you cut through the chaos and toxicity.
        </p>
        
        <form onSubmit={handleSummarize} className="mt-10 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg">
            <input
              type="text"
              value={subredditUrl}
              onChange={(e) => setSubredditUrl(e.target.value)}
              placeholder="Enter a subreddit or post URL..."
              className="flex-grow bg-transparent text-white placeholder-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-200 disabled:from-orange-400 disabled:to-red-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                  <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                  </>
              ) : "Try Extension"}
            </button>
          </div>
          <p className="mt-4 text-base text-slate-300 h-6">
            e.g., <span key={exampleIndex} className={`inline-block font-medium ${animationClass}`}>{examples[exampleIndex]}</span>
          </p>
        </form>
        {error && <p className="mt-4 text-red-400 bg-red-900/50 px-4 py-2 rounded-md inline-block">{error}</p>}
        
        {summaryData && !error && (
            <div className="mt-8 max-w-2xl mx-auto animate-fade-in">
                <div className="p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-left shadow-2xl">
                {summaryData.sensitivityScore && (
                    <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg font-bold text-white">Sensitivity Score:</h3>
                    <span className={`px-3 py-1 text-base font-bold rounded-full border ${getScoreColor(summaryData.sensitivityScore)}`}>
                        {summaryData.sensitivityScore} / 10
                    </span>
                    </div>
                )}
                <h3 className="text-lg font-bold text-white mb-2">Summary:</h3>
                <div className="text-slate-200 leading-relaxed max-h-48 overflow-y-auto" dangerouslySetInnerHTML={{ __html: summaryData.summary }} />
                </div>
            </div>
        )}
      </div>
    </section>
  );
};