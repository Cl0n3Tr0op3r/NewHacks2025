import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustedBy } from './components/TrustedBy';
import { Features } from './components/Features';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-slate-50 overflow-x-hidden">
      <Header />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default App;