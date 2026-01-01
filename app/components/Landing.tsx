
import React from 'react';
import { Shield, Zap, Cpu, Database, TrendingUp, Layers, ArrowUp, ArrowDown } from 'lucide-react';

const Landing: React.FC = () => {
  const partnerLogos = [
    { src: "https://avatars.githubusercontent.com/u/104390117", alt: "Starknet Foundation", class: "h-16 md:h-20" },
    { src: "https://www.cairo-lang.org/wp-content/uploads/2024/03/Cairo-logo.png", alt: "Cairo", class: "h-16 md:h-20" },
    { src: "https://www.gstatic.com/devrel-devsite/prod/ve08add287a6b4bdf8961ab8a1be50bf551be3816cdd70b7cc934114ff3ad5f10/firebase/images/touchicon-180.png", alt: "Firebase", class: "h-16 md:h-20" },
    { src: "https://www.chipipay.com/chipi-white.png", alt: "ChipiPay", class: "h-12 md:h-14" },
    { src: "https://docs.vesu.xyz/img/logo.png", alt: "Vesu", class: "h-10 md:h-12 brightness-0 invert" }
  ];

  // Double the logos for a seamless infinite loop
  const carouselLogos = [...partnerLogos, ...partnerLogos];

  return (
    <div className="pt-20 pb-20 overflow-x-hidden">
      {/* CSS for Infinite Carousel */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50%)); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 35s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Hero Section */}
      <section className="px-6 max-w-7xl mx-auto flex flex-col justify-start pt-2 min-h-[70vh]">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-4">
          <div className="order-1">
            <div className="inline-block px-3 py-1 border border-white/20 text-[10px] uppercase tracking-[0.3em] text-zinc-300 mb-4 animate-pulse">
              Universal Web3 SDK v1.0
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 leading-[0.9]">
              <span className="text-white">
                SERVERLESS <br /> W3 SDK.
              </span>
            </h1>
            <p className="text-xl text-zinc-300 max-w-xl font-light leading-relaxed">
              Unlock the full potential of Web3 with a single line of code. 
              OpenTheDoorz provides social login, encrypted cloud storage, and high-speed execution—completely serverless.
            </p>
          </div>

          {/* Wallet Preview in Hero - Now visible on mobile too */}
          <div className="relative order-2 block mt-12 lg:mt-0">
            <div className="absolute -inset-20 bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="relative z-10 border border-white/10 bg-black w-full max-w-[380px] mx-auto shadow-[0_0_100px_rgba(255,255,255,0.05)] lg:rotate-1 hover:rotate-0 transition-transform duration-700">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-xs">OTD</div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Preview Mode</span>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-zinc-900/40 border border-white/10 mb-4 flex flex-col relative overflow-hidden">
                  <div className="p-4">
                    <div className="text-[8px] uppercase text-zinc-300 font-bold tracking-widest mb-1">Active Wallet</div>
                    <div className="font-mono text-[10px] text-zinc-400 mb-2 tracking-tighter">0x0471...952a</div>
                    <div className="text-2xl font-extrabold tracking-tighter text-white">$5,352.60</div>
                  </div>
                  <div className="grid grid-cols-2 border-t border-white/10 bg-white/5">
                    <div className="py-2.5 flex items-center justify-center gap-1.5 border-r border-white/10 text-[8px] uppercase font-bold tracking-widest text-zinc-300">
                      <ArrowUp size={10} /> Send
                    </div>
                    <div className="py-2.5 flex items-center justify-center gap-1.5 text-[8px] uppercase font-bold tracking-widest text-zinc-300">
                      <ArrowDown size={10} /> Receive
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1.5 mb-6">
                  {['Storage', 'Lending', 'Staging'].map((label, idx) => (
                    <div key={label} className="flex flex-col items-center gap-1 p-2 border border-white/5 bg-zinc-950/50">
                      {idx === 0 ? <Database size={12} className="text-zinc-300" /> : idx === 1 ? <TrendingUp size={12} className="text-zinc-300" /> : <Layers size={12} className="text-zinc-300" />}
                      <span className="text-[7px] uppercase font-bold tracking-widest text-zinc-300">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Powered By Infinite Carousel */}
        <div className="w-full mt-4 py-8 border-t border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto mb-6 text-center">
            <span className="text-[9px] uppercase tracking-[0.6em] text-zinc-300 font-bold">Universal Integration Layer</span>
          </div>
          
          <div className="relative">
            {/* Masking Gradients */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
            
            <div className="animate-scroll">
              {carouselLogos.map((logo, index) => (
                <div 
                  key={index} 
                  className="relative group px-6 md:px-16 flex items-center justify-center min-w-[140px] md:min-w-[200px]"
                >
                  {/* Halo Glow Effect */}
                  <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-[2.5] z-0"></div>
                  
                  <img 
                    src={logo.src} 
                    alt={logo.alt} 
                    className={`${logo.class} relative z-10 transition-all duration-500 hover:scale-110 active:scale-95 object-contain`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 mt-12">
        <FeatureCard 
          icon={<Shield size={24} />} 
          title="Serverless Identity" 
          desc="Drop-in social login and non-custodial wallet creation using secure email/password auth protocols."
        />
        <FeatureCard 
          icon={<Zap size={24} />} 
          title="Universal Bridge" 
          desc="Low-latency transaction execution and cross-chain bridging capabilities built directly into the SDK."
        />
        <FeatureCard 
          icon={<Database size={24} />} 
          title="Cloud Storage" 
          desc="Encrypted user data and session management powered by Firebase for a persistent Web3 profile."
        />
        <FeatureCard 
          icon={<Cpu size={24} />} 
          title="One-Line Integration" 
          desc="A comprehensive developer experience designed for high-performance applications and clean stacks."
        />
      </section>

      {/* Code Preview Section */}
      <section className="px-6 max-w-5xl mx-auto mt-40">
        <div className="border border-white/10 p-1">
          <div className="bg-zinc-900/50 p-6 md:p-12 border border-white/10">
            <h2 className="text-3xl font-bold tracking-tight mb-6 uppercase tracking-tighter text-white">INTEGRATE IN MINUTES</h2>
            <div className="bg-black border border-white/5 rounded p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-zinc-300">
                <code>{`// Initialize OpenTheDoorz
import { DoorzProvider } from '@openthedoorz/sdk';

function App() {
  return (
    <DoorzProvider 
      apiKey="your_api_key" 
      storage="serverless-firebase"
      bridge="auto"
    >
      <YourApp />
    </DoorzProvider>
  );
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-black p-8 group hover:bg-zinc-900 transition-colors">
    <div className="mb-6 text-zinc-300 group-hover:text-white transition-colors">{icon}</div>
    <h3 className="text-lg font-bold mb-3 uppercase tracking-wider text-white">{title}</h3>
    <p className="text-sm text-zinc-300 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
