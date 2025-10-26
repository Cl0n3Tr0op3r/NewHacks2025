import React from 'react';

export const TrustedBy: React.FC = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-6">
        <h2 className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider">
          PERFECT FOR EXPLORING SUBREDDITS SUCH AS
        </h2>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          <div className="flex justify-center">
            <p className="text-3xl font-bold text-slate-400">r/UofT</p>
          </div>
          <div className="flex justify-center">
             <p className="text-3xl font-bold text-slate-400">r/CSmajors</p>
          </div>
          <div className="flex justify-center">
             <p className="text-3xl font-bold text-slate-400">r/Hackertons</p>
          </div>
          <div className="flex justify-center">
             <p className="text-3xl font-bold text-slate-400">r/Newhacks</p>
          </div>
        </div>
      </div>
    </div>
  );
};