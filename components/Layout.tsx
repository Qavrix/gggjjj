
import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto px-6 py-8">
      <header className="mb-12 flex justify-between items-center">
        <Link to="/" className="text-4xl font-mono-one tracking-tight">
          <span className="text-white">Algo</span>
          <span className="text-red-500">Q</span>
          <span className="text-white ml-3">Reports</span>
        </Link>
        <nav className="text-sm font-light text-zinc-500 hover:text-zinc-300 transition-colors">
          <a href={`https://github.com/AlgoQ`} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>

      <footer className="mt-20 pt-8 border-t border-zinc-900 text-zinc-600 text-xs flex justify-between">
        <p>© {new Date().getFullYear()} AlgoQ</p>
        <p>Built for cTrader Ecosystem</p>
      </footer>
    </div>
  );
};

export default Layout;
