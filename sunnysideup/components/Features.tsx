import React from 'react';

const FeatureCard: React.FC<{ icon: React.ReactElement; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200">
    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white">
      {icon}
    </div>
    <h3 className="mt-5 text-xl font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-base text-slate-600">{children}</p>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">The Antidote to Information Overload</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            This is more than just a summarizer. It's your personal guide to the vast world of Reddit.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            title="Instant AI Summaries"
          >
            Get the gist of any subreddit in seconds. Our advanced AI reads through top posts and comments to give you a clear, concise overview.
          </FeatureCard>
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title="Sentiment Analysis"
          >
            Quickly gauge the vibe of a community. We analyze the overall sentiment to tell you if it's generally positive, negative, or a meme-fest.
          </FeatureCard>
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>}
            title="Key Topic Extraction"
          >
            Discover what people are actually talking about. Our AI identifies and highlights the most common themes and discussion points.
          </FeatureCard>
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
            title="One-Click Integration"
          >
            Our browser extension seamlessly integrates with Reddit. A "Sunnysideup" button appears on every subreddit page for instant summaries.
          </FeatureCard>
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m0-8v-2m0 4h.01M6 12H4m16 0h-2m-8 0h.01M12 18h.01M18 12h.01M6 6l1.414-1.414M18 18l-1.414-1.414M18 6l-1.414 1.414M6 18l1.414-1.414" /></svg>}
            title="Customizable Length"
          >
            Need a quick overview or a more detailed brief? Adjust the summary length to fit your needs, from a single paragraph to a full page.
          </FeatureCard>
          <FeatureCard 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>}
            title="Summary History"
          >
            Keep track of the subreddits you've explored. Access your summary history anytime to revisit communities or compare them.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};