import React from 'react';
import Link from 'next/link';
import {
  Zap, Shield, Rocket, Lock, Users, Globe,
  ArrowUp, ArrowDown, CheckCircle2, CircleDot, X,
  Target, Lightbulb, Database, TrendingUp, Layers,
  Settings, Eye, RefreshCw, ChevronRight, ExternalLink,
  Smartphone, Code2, Mail, MessageSquare, Twitter,
  Facebook, Github, Linkedin, Youtube, Instagram,
  Wallet, Key, Cloud, BarChart, Cpu, ShieldCheck,
  Calendar, FileText, GitBranch, Terminal, MessageCircle, Gift
} from 'lucide-react';

interface LandingProps {
  onOpenWallet?: () => void;
}

const Landing: React.FC<LandingProps> = ({ onOpenWallet }) => {
  const partnerLogos = [
    { src: "https://starknet.io/logo.png", alt: "Starknet", class: "h-12 md:h-14" },
    { src: "https://avatars.githubusercontent.com/u/104390117", alt: "Starknet Foundation", class: "h-14 md:h-16" },
    { src: "https://www.cairo-lang.org/wp-content/uploads/2024/03/Cairo-logo.png", alt: "Cairo", class: "h-14 md:h-16" },
    { src: "https://www.gstatic.com/devrel-devsite/prod/ve08add287a6b4bdf8961ab8a1be50bf551be3816cdd70b7cc934114ff3ad5f10/firebase/images/touchicon-180.png", alt: "Firebase", class: "h-14 md:h-16" }
  ];

  const carouselLogos = [...partnerLogos, ...partnerLogos];

  return (
    <div className="bg-black pt-16 md:pt-20 overflow-x-hidden selection:bg-white selection:text-black">
      {/* CSS for Infinite Carousel */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50%)); }
        }
        .animate-scroll {
          display: flex;
          width: max-content;
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section id="hero" className="px-6 max-w-7xl mx-auto flex flex-col justify-center min-h-[75vh] md:min-h-[85vh] py-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-20 animate-in">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                🟢 LIVE ON MAINNET • NO SEED PHRASES
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black tracking-tighter leading-[0.85] uppercase">
              The Next Gen <br />
              <span className="text-zinc-500">Starknet Wallet</span> <br />
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Powering You</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-xl font-light leading-relaxed">
              Send, receive, and trade assets on Starknet mainnet. No complex setup. No seed phrases to memorize. Just connect and go.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={onOpenWallet}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all flex items-center gap-2 group"
              >
                Get Early Access <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-black bg-blue-500 flex items-center justify-center text-[10px] font-bold">G</div>
                <div className="w-8 h-8 rounded-full border-2 border-black bg-sky-500 flex items-center justify-center text-[10px] font-bold">T</div>
                <div className="w-8 h-8 rounded-full border-2 border-black bg-purple-500 flex items-center justify-center text-[10px] font-bold">D</div>
              </div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Connect with Google, Twitter, Discord</span>
            </div>
          </div>

          <div className="relative group perspective-1000">
            <div className="absolute -inset-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-[120px] rounded-full pointer-events-none group-hover:opacity-80 transition-opacity" />
            <div className="relative z-10 border border-white/10 bg-black w-full max-w-[420px] mx-auto shadow-2xl lg:rotate-1 hover:rotate-0 transition-all duration-1000 ease-out p-1">
              <div className="border border-white/5">
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-black text-xs">RW</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">Welcome to Reflecter 👋</span>
                  </div>
                  <Settings size={14} className="text-zinc-500" />
                </div>
                <div className="p-6 bg-black">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] uppercase text-zinc-500 font-bold tracking-widest">Portfolio Value</span>
                        <RefreshCw size={10} className="text-zinc-700" />
                      </div>
                      <span className="px-2 py-0.5 border border-emerald-500/20 text-emerald-500 text-[7px] font-black uppercase tracking-widest bg-emerald-500/5 rounded-full flex items-center gap-1">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full" /> Mainnet
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-5xl font-black tracking-tighter text-white font-mono">$1,248.50</div>
                      <Eye size={16} className="text-zinc-700" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <button className="py-3 border border-white/10 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                      <ArrowUp size={12} /> Send
                    </button>
                    <button className="py-3 border border-white/10 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                      <ArrowDown size={12} /> Receive
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-8">
                    <div className="flex flex-col items-center gap-2.5 p-4 border border-white/5 bg-zinc-950/50">
                      <ArrowUp size={16} className="text-white" />
                      <span className="text-[7px] uppercase font-bold tracking-[0.2em] text-zinc-400">Send</span>
                    </div>
                    <div className="flex flex-col items-center gap-2.5 p-4 border border-white/5 bg-zinc-950/50">
                      <ArrowDown size={16} className="text-white" />
                      <span className="text-[7px] uppercase font-bold tracking-[0.2em] text-zinc-400">Receive</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 mb-4 px-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white border-b-2 border-white pb-2.5">Assets</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 pb-2.5">Transactions</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="p-3 border border-white/5 bg-zinc-950/20 flex items-center justify-between group/asset">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-none border border-white/10 bg-white/5 flex items-center justify-center grayscale transition-all group-hover/asset:grayscale-0">
                          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" className="w-4 h-4 opacity-50 group-hover/asset:opacity-100" alt="eth" />
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-white uppercase tracking-tight">Ethereum</div>
                          <div className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest">0.00034 ETH</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black text-white">$1,06</div>
                        <div className="text-[6px] text-zinc-700 font-bold uppercase">$3,113.70 / u</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-[0.2em] text-zinc-700">
                    <span>reflecterwallet.xyz</span>
                    <span>v1.0.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partners Carousel */}
        <div className="w-full mt-0 pt-12 border-t border-white/[0.05] overflow-hidden">
          <div className="max-w-7xl mx-auto mb-10 text-center text-[9px] uppercase tracking-[0.6em] text-zinc-500 font-bold">
            Built for the Starknet Ecosystem
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

            <div className="animate-scroll">
              {carouselLogos.map((logo, index) => (
                <div key={index} className="px-12 md:px-20 flex items-center justify-center min-w-[160px] md:min-w-[240px]">
                  <img src={logo.src} alt={logo.alt} className={`${logo.class} opacity-90 transition-all duration-500 object-contain`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENEFICIOS PRINCIPALES */}
      <section id="benefits" className="py-32 px-6 border-y border-white/[0.05] bg-zinc-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <div className="flex items-center justify-center gap-4 text-zinc-600">
              <div className="h-px w-8 bg-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Why Choose Reflecter</span>
              <div className="h-px w-8 bg-current" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Experience Web3 Without Friction</h2>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
              The simplest way to access Starknet's full potential
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-10 border border-white/[0.05] hover:border-white/20 transition-all duration-500 hover:bg-zinc-950/50 group">
              <div className="mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 flex items-center justify-center mb-6">
                  <Zap size={24} className="text-blue-500" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Zero Friction</h3>
                <p className="text-zinc-500 font-light leading-relaxed text-sm">
                  Sign up with Google, Twitter, or Discord. No seed phrases to manage. Institutional-grade security.
                </p>
              </div>
            </div>

            <div className="p-10 border border-white/[0.05] hover:border-white/20 transition-all duration-500 hover:bg-zinc-950/50 group">
              <div className="mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 flex items-center justify-center mb-6">
                  <Gift size={24} className="text-purple-500" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Rewards & Cards</h3>
                <p className="text-zinc-500 font-light leading-relaxed text-sm">
                  Earn points for every action. Request your physical card and spend your crypto anywhere. (Coming Soon)
                </p>
              </div>
            </div>

            <div className="p-10 border border-white/[0.05] hover:border-white/20 transition-all duration-500 hover:bg-zinc-950/50 group">
              <div className="mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <Rocket size={24} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Starknet Native</h3>
                <p className="text-zinc-500 font-light leading-relaxed text-sm">
                  Built on Cairo. Experience instant confirmation and near-zero gas fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEMOSTRACIÓN VISUAL */}
      <section id="demo" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <div className="flex items-center justify-center gap-4 text-zinc-600">
              <div className="h-px w-8 bg-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">How It Works</span>
              <div className="h-px w-8 bg-current" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">See How It Works</h2>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
              Get started with Reflecter Wallet in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-6">
                  <Users size={32} className="text-blue-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-white font-black text-lg">1</div>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Connect Social Account</h3>
              <p className="text-zinc-500 font-light leading-relaxed">
                Sign in with Google, Twitter, or Discord. No seed phrases, no complex setup.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto mb-6">
                  <Wallet size={32} className="text-purple-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-white font-black text-lg">2</div>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Wallet Ready Instantly</h3>
              <p className="text-zinc-500 font-light leading-relaxed">
                Your Starknet wallet is created automatically. Start using DeFi immediately.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp size={32} className="text-emerald-500" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-white font-black text-lg">3</div>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Trade & Earn</h3>
              <p className="text-zinc-500 font-light leading-relaxed">
                Send, receive, swap assets, and access liquidity pools on Starknet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPARACIÓN */}
      <section id="comparison" className="py-32 px-6 border-y border-white/[0.05] bg-zinc-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <div className="flex items-center justify-center gap-4 text-zinc-600">
              <div className="h-px w-8 bg-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">The Better Choice</span>
              <div className="h-px w-8 bg-current" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Why Reflecter Wallet?</h2>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
              Compare the modern wallet experience with traditional solutions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Feature</th>
                  <th className="text-center py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Reflecter Wallet</th>
                  <th className="text-center py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Traditional Wallets</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-6 px-4 text-sm font-bold text-white">Onboarding Time</td>
                  <td className="py-6 px-4 text-center">
                    <span className="inline-flex items-center gap-2 text-emerald-500 font-black text-sm">
                      <Zap size={14} /> 5 seconds
                    </span>
                  </td>
                  <td className="py-6 px-4 text-center text-zinc-500 font-bold">5+ minutes</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-6 px-4 text-sm font-bold text-white">Setup Complexity</td>
                  <td className="py-6 px-4 text-center">
                    <span className="inline-flex items-center gap-2 text-emerald-500 font-black text-sm">
                      <Users size={14} /> Social login
                    </span>
                  </td>
                  <td className="py-6 px-4 text-center text-zinc-500 font-bold">12-24 word seed phrase</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-6 px-4 text-sm font-bold text-white">Account Recovery</td>
                  <td className="py-6 px-4 text-center">
                    <span className="inline-flex items-center gap-2 text-emerald-500 font-black text-sm">
                      <ShieldCheck size={14} /> Email/social recovery
                    </span>
                  </td>
                  <td className="py-6 px-4 text-center text-zinc-500 font-bold">Manual seed phrase backup</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-6 px-4 text-sm font-bold text-white">Starknet Support</td>
                  <td className="py-6 px-4 text-center">
                    <span className="inline-flex items-center gap-2 text-emerald-500 font-black text-sm">
                      <Rocket size={14} /> Native & optimized
                    </span>
                  </td>
                  <td className="py-6 px-4 text-center text-zinc-500 font-bold">Limited or none</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="py-6 px-4 text-sm font-bold text-white">DeFi Integration</td>
                  <td className="py-6 px-4 text-center">
                    <span className="inline-flex items-center gap-2 text-emerald-500 font-black text-sm">
                      <TrendingUp size={14} /> Built-in pools & trading
                    </span>
                  </td>
                  <td className="py-6 px-4 text-center text-zinc-500 font-bold">External dApps required</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. SOCIAL PROOF */}
      <section id="social-proof" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <div className="flex items-center justify-center gap-4 text-zinc-600">
              <div className="h-px w-8 bg-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Trust & Adoption</span>
              <div className="h-px w-8 bg-current" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Built for the Starknet Ecosystem</h2>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
              Production-ready infrastructure built by Reflecter Labs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-10 border border-white/[0.05] hover:border-white/20 transition-all">
              <div className="text-5xl font-black text-white mb-4">1,200+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Wallets Created</div>
              <p className="text-zinc-500 text-sm">Active users on Starknet mainnet</p>
            </div>
            <div className="text-center p-10 border border-white/[0.05] hover:border-white/20 transition-all">
              <div className="text-5xl font-black text-white mb-4">$2.4M+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Transacted</div>
              <p className="text-zinc-500 text-sm">Total volume on mainnet</p>
            </div>
            <div className="text-center p-10 border border-white/[0.05] hover:border-white/20 transition-all">
              <div className="text-5xl font-black text-white mb-4">99.9%</div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Uptime</div>
              <p className="text-zinc-500 text-sm">Production reliability</p>
            </div>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 border border-white/10 rounded-full bg-white/5">
              <img src="https://starknet.io/logo.png" className="h-8" alt="Starknet" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                BUILT ON STARKNET
              </span>
            </div>
            <p className="mt-8 text-zinc-500 text-sm max-w-2xl mx-auto">
              "Enterprise-grade security. Built by Reflecter Labs."
            </p>
          </div>
        </div>
      </section>

      {/* 6. ROADMAP */}
      <section id="roadmap" className="py-32 px-6 border-y border-white/[0.05] bg-zinc-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <div className="flex items-center justify-center gap-4 text-zinc-600">
              <div className="h-px w-8 bg-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Our Journey</span>
              <div className="h-px w-8 bg-current" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Product Roadmap</h2>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
              We are building the most advanced financial super-app on Starknet.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-10 border border-white/[0.05] hover:border-white/20 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-emerald-500" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Phase 1</div>
                  <div className="text-lg font-black text-white">Live Now</div>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  Send & receive assets on Starknet mainnet
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  Social login onboarding
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  Production-ready infrastructure
                </li>
              </ul>
            </div>

            <div className="p-10 border border-white/[0.05] hover:border-white/20 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <RefreshCw size={20} className="text-blue-500 animate-spin" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Phase 2</div>
                  <div className="text-lg font-black text-white">In Development</div>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <CircleDot size={12} className="text-blue-500 animate-pulse" />
                  Access to liquidity pools
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <CircleDot size={12} className="text-blue-500 animate-pulse" />
                  Yield farming integration
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <CircleDot size={12} className="text-blue-500 animate-pulse" />
                  Multi-asset swaps
                </li>
              </ul>
            </div>

            <div className="p-10 border border-white/[0.05] hover:border-white/20 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Calendar size={20} className="text-purple-500" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-500">Phase 3</div>
                  <div className="text-lg font-black text-white">Coming Q1 2026</div>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <CircleDot size={12} className="text-purple-500" />
                  Algorithmic trading strategies
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <CircleDot size={12} className="text-purple-500" />
                  Advanced portfolio analytics
                </li>
                <li className="flex items-center gap-2 text-sm text-zinc-400">
                  <CircleDot size={12} className="text-purple-500" />
                  Mobile app (iOS/Android)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* 8. FINAL CTA */}
      <section id="final-cta" className="py-32 px-6 border-y border-white/[0.05] bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8">
            Ready to Experience Web3 Without Friction?
          </h2>
          <p className="text-xl text-zinc-500 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Join the Starknet ecosystem with the simplest wallet onboarding.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={onOpenWallet}
              className="px-12 py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
            >
              Create Wallet Now <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button className="px-12 py-5 bg-transparent border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
              Join Our Community
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="py-24 px-6 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-1 space-y-8">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-black text-lg">RW</div>
              <p className="text-zinc-500 text-sm font-light leading-relaxed">
                Your Starknet wallet without seed phrases. Social login, full DeFi access, Starknet native.
              </p>
              <div className="flex gap-4">
                <Twitter size={16} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                <Github size={16} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                <MessageSquare size={16} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                <MessageCircle size={16} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em]">Community</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-zinc-600">
                <li className="hover:text-white transition-colors cursor-pointer">Twitter/X</li>
                <li className="hover:text-white transition-colors cursor-pointer">Discord</li>
                <li className="hover:text-white transition-colors cursor-pointer">Telegram</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em]">Legal</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-zinc-600">
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-white transition-colors cursor-pointer">Security Audits</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/[0.05] gap-8">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">
              Built with ❤️ by Reflecter Labs | Powered by Starknet
            </div>
            <div className="flex items-center gap-4">
              <img src="https://starknet.io/logo.png" className="h-6 opacity-70" alt="Starknet" />
              <img src="https://www.reflecterlabs.xyz/logo.png" className="h-6 opacity-70" alt="Reflecter Labs" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;