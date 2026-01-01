
import React, { useState } from 'react';
import { Terminal, BookOpen, Code, Settings, ChevronRight } from 'lucide-react';

const Docs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: <BookOpen size={16} /> },
    { id: 'installation', title: 'Installation', icon: <Terminal size={16} /> },
    { id: 'sdk-usage', title: 'SDK Usage', icon: <Code size={16} /> },
    { id: 'configuration', title: 'Configuration', icon: <Settings size={16} /> },
  ];

  return (
    <div className="pt-24 flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/10 hidden lg:block sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto p-6">
        <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-6 font-bold">Documentation</div>
        <div className="space-y-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-all border ${
                activeSection === section.id 
                  ? 'bg-white text-black border-white' 
                  : 'text-zinc-400 border-transparent hover:border-white/10 hover:text-white'
              }`}
            >
              {section.icon}
              {section.title}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 lg:p-20 max-w-4xl">
        {activeSection === 'getting-started' && (
          <article className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-4xl font-extrabold tracking-tighter mb-6">GETTING STARTED</h1>
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              OpenTheDoorz is a modular Web3 wallet infrastructure designed for developers who value performance and aesthetic simplicity. Our SDK provides a drop-in Starknet bridge for traditional Web2 stacks.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="border border-white/10 p-6 bg-zinc-900/20">
                <h3 className="font-bold mb-2 uppercase tracking-tight">Core Concept</h3>
                <p className="text-sm text-zinc-500">We use ChipiPay for liquidity and Firebase for decentralized identity management, creating a hybrid trust model.</p>
              </div>
              <div className="border border-white/10 p-6 bg-zinc-900/20">
                <h3 className="font-bold mb-2 uppercase tracking-tight">Prerequisites</h3>
                <p className="text-sm text-zinc-500">A Starknet developer account and a Firebase project instance are required for full integration.</p>
              </div>
            </div>
          </article>
        )}

        {activeSection === 'installation' && (
          <article className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-4xl font-extrabold tracking-tighter mb-6">INSTALLATION</h1>
            <p className="text-zinc-400 mb-8">Install the core package and its peer dependencies using your preferred package manager.</p>
            <div className="bg-zinc-950 border border-white/10 p-4 font-mono text-sm mb-8 flex items-center justify-between group">
              <code className="text-zinc-300">npm install @openthedoorz/sdk starknet chipipay-sdk</code>
              <button className="text-[10px] text-zinc-600 uppercase hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">Copy</button>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mt-12 mb-4">ENVIRONMENT SETUP</h2>
            <div className="bg-zinc-950 border border-white/10 p-4 font-mono text-sm text-zinc-500">
              <div>NEXT_PUBLIC_DOORZ_CLIENT_ID=your_id</div>
              <div>NEXT_PUBLIC_STARKNET_NETWORK=mainnet</div>
            </div>
          </article>
        )}

        {activeSection === 'sdk-usage' && (
          <article className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-4xl font-extrabold tracking-tighter mb-6">SDK USAGE</h1>
            <p className="text-zinc-400 mb-8">Access the bridge programmatically using our high-level hooks.</p>
            <div className="bg-zinc-950 border border-white/10 p-4 font-mono text-sm mb-8">
              <pre className="text-zinc-400">
                <code>{`import { useDoorz } from '@openthedoorz/sdk';

const WalletButton = () => {
  const { connect, address, balance } = useDoorz();

  return (
    <button onClick={connect}>
      {address ? \`Connected: \${address.slice(0, 6)}\` : 'Open Door'}
    </button>
  );
};`}</code>
              </pre>
            </div>
          </article>
        )}

        <div className="mt-20 pt-12 border-t border-white/10 flex justify-between">
          <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
            Previous Section
          </button>
          <button 
            onClick={() => setActiveSection(sections[(sections.findIndex(s => s.id === activeSection) + 1) % sections.length].id)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            Next Section <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Docs;
