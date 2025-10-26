
import React from 'react';

const CheckIcon = () => (
  <svg className="h-6 w-6 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-slate-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Find the perfect plan</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
            Start for free, and unlock powerful features as you grow.
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Free Plan */}
          <div className="border border-slate-700 rounded-xl p-8 flex flex-col">
            <h3 className="text-2xl font-semibold text-white">Hobby</h3>
            <p className="mt-2 text-slate-400">For casual Reddit explorers.</p>
            <div className="mt-6">
              <span className="text-5xl font-extrabold text-white">$0</span>
              <span className="text-base font-medium text-slate-400">/mo</span>
            </div>
            <ul className="mt-8 space-y-4 text-slate-300">
              <li className="flex items-center gap-3"><CheckIcon /> 5 summaries per day</li>
              <li className="flex items-center gap-3"><CheckIcon /> Standard summary length</li>
              <li className="flex items-center gap-3"><CheckIcon /> Browser extension</li>
            </ul>
            <button className="mt-8 w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Get Started for Free
            </button>
          </div>
          
          {/* Pro Plan - Highlighted */}
          <div className="relative border-2 border-orange-500 rounded-xl p-8 flex flex-col shadow-2xl shadow-orange-500/20">
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold tracking-wider text-white bg-gradient-to-r from-orange-500 to-red-600">
                    Most Popular
                </span>
            </div>
            <h3 className="text-2xl font-semibold text-white">Pro</h3>
            <p className="mt-2 text-slate-400">For power users and researchers.</p>
            <div className="mt-6">
              <span className="text-5xl font-extrabold text-white">$9</span>
              <span className="text-base font-medium text-slate-400">/mo</span>
            </div>
            <ul className="mt-8 space-y-4 text-slate-300">
              <li className="flex items-center gap-3"><CheckIcon /> Unlimited summaries</li>
              <li className="flex items-center gap-3"><CheckIcon /> Customizable summary length</li>
              <li className="flex items-center gap-3"><CheckIcon /> Sentiment analysis</li>
              <li className="flex items-center gap-3"><CheckIcon /> Key topic extraction</li>
              <li className="flex items-center gap-3"><CheckIcon /> Summary history</li>
              <li className="flex items-center gap-3"><CheckIcon /> Priority support</li>
            </ul>
            <button className="mt-8 w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Choose Pro
            </button>
          </div>
          
          {/* Team Plan */}
          <div className="border border-slate-700 rounded-xl p-8 flex flex-col">
            <h3 className="text-2xl font-semibold text-white">Business</h3>
            <p className="mt-2 text-slate-400">For teams and content creators.</p>
            <div className="mt-6">
              <span className="text-5xl font-extrabold text-white">$29</span>
              <span className="text-base font-medium text-slate-400">/mo</span>
            </div>
            <ul className="mt-8 space-y-4 text-slate-300">
              <li className="flex items-center gap-3"><CheckIcon /> Everything in Pro</li>
              <li className="flex items-center gap-3"><CheckIcon /> Team collaboration</li>
              <li className="flex items-center gap-3"><CheckIcon /> API access</li>
              <li className="flex items-center gap-3"><CheckIcon /> Bulk summarization</li>
            </ul>
            <button className="mt-8 w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};