import React, { useState } from 'react';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMobileLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    handleScroll(e, targetId);
    setIsOpen(false); // Close menu after click
  }

  const headerClasses = `sticky top-0 z-50 transition-all duration-300 bg-white border-b border-slate-200 shadow-sm`;
  const linkClasses = `transition-colors text-slate-600 hover:text-orange-600`;
  const logoClasses = `text-2xl font-extrabold tracking-tighter transition-colors text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600`;
  const hamburgerClasses = `transition-colors text-slate-900`;

  return (
    <header className={headerClasses}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#" onClick={handleScrollToTop} className={logoClasses}>
            Sunnysideup
          </a>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" onClick={(e) => handleScroll(e, 'features')} className={linkClasses}>Features</a>
            <button className={linkClasses}>Sign In</button>
            <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200">
              Try Extension
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={`${hamburgerClasses} focus:outline-none`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden mt-4 bg-white/95 backdrop-blur-md rounded-lg p-2">
            <a href="#features" onClick={(e) => handleMobileLinkClick(e, 'features')} className="block py-2 px-4 text-sm text-slate-600 hover:bg-slate-100 rounded">Features</a>
            <div className="mt-2 pt-2 border-t border-slate-200">
                <button className="w-full text-left py-2 px-4 text-sm text-slate-600 hover:bg-slate-100 rounded">Sign In</button>
                <button className="mt-2 w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200">
                  Try Extension
                </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};