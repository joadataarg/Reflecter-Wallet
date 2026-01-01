import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-bold">
          Open Source Product from ReflecterLabs.xyz
        </p>
        <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-bold">
          V0.0.1
        </p>
      </div>
    </footer>
  );
};

export default Footer;
