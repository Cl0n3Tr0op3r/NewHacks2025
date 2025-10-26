import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-medium text-slate-900"
      >
        <span>{question}</span>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}
      >
        <p className="text-slate-600 leading-relaxed">{children}</p>
      </div>
    </div>
  );
};

export const FAQ: React.FC = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-slate-600">
                Have questions? We've got answers. If you can't find what you're looking for, feel free to reach out.
            </p>
        </div>
        <div className="mt-12 max-w-3xl mx-auto">
          <FAQItem question="How does the AI summarization work?">
            We use a state-of-the-art large language model (Gemini) that has been trained on a vast amount of text from the internet. It analyzes the top posts, comments, and community rules of a subreddit to generate a coherent and accurate summary of its purpose, topics, and overall sentiment.
          </FAQItem>
          <FAQItem question="Is this affiliated with Reddit?">
            No, this is an independent project and is not affiliated with, endorsed, or sponsored by Reddit, Inc.
          </FAQItem>
          <FAQItem question="What browsers does the extension support?">
            Currently, our browser extension is available for Google Chrome. We are actively working on versions for Firefox and Safari, which will be released soon.
          </FAQItem>
          <FAQItem question="Can I summarize private or restricted subreddits?">
            Our tool can only access and summarize publicly available subreddits. It cannot access private or quarantined communities. Content from all public subreddits will be analyzed and described factually.
          </FAQItem>
        </div>
      </div>
    </section>
  );
};
