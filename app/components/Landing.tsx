
import React from 'react';
import Link from 'next/link';
import {
  Shield, Zap, Cpu, Database, TrendingUp, Layers,
  ArrowUp, ArrowDown, CheckCircle2, CircleDot,
  Target, Lightbulb, Users, Globe, ExternalLink,
  Smartphone, Code2, Lock, Settings, Eye, RefreshCw, ChevronRight
} from 'lucide-react';

const Landing: React.FC = () => {
  const partnerLogos = [
    { src: "https://avatars.githubusercontent.com/u/104390117", alt: "Starknet Foundation", class: "h-14 md:h-16" },
    { src: "https://www.cairo-lang.org/wp-content/uploads/2024/03/Cairo-logo.png", alt: "Cairo", class: "h-14 md:h-16" },
    { src: "https://www.gstatic.com/devrel-devsite/prod/ve08add287a6b4bdf8961ab8a1be50bf551be3816cdd70b7cc934114ff3ad5f10/firebase/images/touchicon-180.png", alt: "Firebase", class: "h-14 md:h-16" },
    { src: "https://www.chipipay.com/chipi-white.png", alt: "ChipiPay", class: "h-10 md:h-12" },
    { src: "https://docs.vesu.xyz/img/logo.png", alt: "Vesu", class: "h-9 md:h-10 brightness-0 invert" }
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

      {/* Hero Section */}
      <section id="hero" className="px-6 max-w-7xl mx-auto flex flex-col justify-center min-h-[75vh] md:min-h-[85vh] py-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-20 animate-in">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 rounded-full bg-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                STARKNET SDK v1.0 • MAINNET READY
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black tracking-tighter leading-[0.85] uppercase">
              Serverless <br />
              <span className="text-zinc-500">W3 SDK.</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-xl font-light leading-relaxed">
              Unlock the full potential of Starknet with a single line of code.
              OpenTheDoorz provides social login, encrypted cloud storage, and high-speed execution—completely serverless.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-all flex items-center gap-2 group"
              >
                Launch Dashboard <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="px-8 py-4 bg-transparent border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
                Developer Docs
              </button>
            </div>
          </div>

          <div className="relative group perspective-1000">
            <div className="absolute -inset-20 bg-white/[0.03] blur-[120px] rounded-full pointer-events-none group-hover:bg-white/[0.05] transition-colors" />
            <div className="relative z-10 border border-white/10 bg-black w-full max-w-[420px] mx-auto shadow-2xl lg:rotate-1 hover:rotate-0 transition-all duration-1000 ease-out p-1">
              <div className="border border-white/5">
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black text-xs">OTD</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">Hola Lucia 👋</span>
                  </div>
                  <Settings size={14} className="text-zinc-500" />
                </div>
                <div className="p-6 bg-black">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] uppercase text-zinc-500 font-bold tracking-widest">Net Value</span>
                        <RefreshCw size={10} className="text-zinc-700" />
                      </div>
                      <span className="px-2 py-0.5 border border-emerald-500/20 text-emerald-500 text-[7px] font-black uppercase tracking-widest bg-emerald-500/5 rounded-full flex items-center gap-1">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full" /> Mainnet
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-5xl font-black tracking-tighter text-white font-mono">$1,06</div>
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

                  <div className="grid grid-cols-3 gap-2 mb-8">
                    {['Storage', 'Lending', 'Staging'].map((label, idx) => (
                      <div key={label} className="flex flex-col items-center gap-2.5 p-4 border border-white/5 bg-zinc-950/50 hover:bg-zinc-900 transition-colors cursor-pointer">
                        {idx === 0 ? <Database size={16} className="text-white" /> : idx === 1 ? <TrendingUp size={16} className="text-white" /> : <Layers size={16} className="text-white" />}
                        <span className="text-[7px] uppercase font-bold tracking-[0.2em] text-zinc-400">{label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 mb-4 px-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white border-b-2 border-white pb-2.5">Assets</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 pb-2.5 hover:text-zinc-400 cursor-pointer transition-colors">Positions</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 pb-2.5 hover:text-zinc-400 cursor-pointer transition-colors">Bot Trading</span>
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
                    <span>reflecterlabs.xyz</span>
                    <span>v0.0.1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partners Carousel */}
        <div className="w-full mt-0 pt-12 border-t border-white/[0.05] overflow-hidden">
          <div className="max-w-7xl mx-auto mb-10 text-center text-[9px] uppercase tracking-[0.6em] text-zinc-500 font-bold">
            Trusted by Builders & Foundations
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

      {/* ROADMAP SECTION */}
      <section id="roadmap" className="py-32 px-6 border-y border-white/[0.05] bg-zinc-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <div className="flex items-center justify-center gap-4 text-zinc-600">
              <div className="h-px w-8 bg-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Path to Adoption</span>
              <div className="h-px w-8 bg-current" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Product Roadmap</h2>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
              From initial concept to global scale. Follow our journey as we build <br className="hidden md:block" /> the infrastructure for the Starknet ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RoadmapStep number="01" title="PoC" status="Completed" desc="Validation of core social login and serverless Starknet architecture." completed />
            <RoadmapStep number="02" title="MVP" status="In Progress" desc="Vesu lending integration, real-time balances, and UI optimization." active />
            <RoadmapStep number="03" title="Production" status="Planned 2026" desc="Mainnet deployment with institutional security and full SDK release." />
            <RoadmapStep number="04" title="Take-off" status="Planned 2026" desc="Ecosystem mass adoption phase and global developer onboarding." />
          </div>
        </div>
      </section>

      {/* ADDED VALUE SECTION */}
      <section id="philosophy" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-6">
            <div className="flex items-center justify-center gap-4 text-zinc-600">
              <div className="h-px w-8 bg-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Core Philosophy</span>
              <div className="h-px w-8 bg-current" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">ADDED VALUE</h2>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
              "Building the infrastructure for the next billion Web3 users."
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.05] border border-white/[0.05]">
            <div className="bg-black p-12 space-y-8 flex flex-col justify-between hover:bg-zinc-950/50 transition-colors group">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-zinc-500 group-hover:text-white transition-colors">
                  <Target size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Purpose</span>
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Mission</h3>
                <p className="text-zinc-500 font-light leading-relaxed text-sm group-hover:text-zinc-400 transition-colors">
                  To democratize access to Starknet by abstracting complex blockchain interactions into a single, high-performance SDK that feels invisible.
                </p>
              </div>
            </div>

            <div className="bg-black p-12 space-y-8 flex flex-col justify-between hover:bg-zinc-950/50 transition-colors group">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-zinc-500 group-hover:text-white transition-colors">
                  <Lightbulb size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Future</span>
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Vision</h3>
                <p className="text-zinc-500 font-light leading-relaxed text-sm group-hover:text-zinc-400 transition-colors">
                  Becoming the horizontal interaction layer for the decentralized economy, where security and UX coexist without compromise.
                </p>
              </div>
            </div>

            <div className="bg-black p-12 space-y-8 flex flex-col justify-between hover:bg-zinc-950/50 transition-colors group">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-zinc-500 group-hover:text-white transition-colors">
                  <Shield size={20} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Our Core</span>
                </div>
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Values</h3>
                <div className="space-y-4 pt-2">
                  <div className="flex flex-col">
                    <span className="text-white text-[11px] font-black uppercase tracking-tight">Radical Simplicity</span>
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Complexity abstracted.</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-[11px] font-black uppercase tracking-tight">Serverless First</span>
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">True Decentralization.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SOLUTIONS SECTION */}
      <section id="solutions" className="py-32 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24 space-y-6">
            <div className="flex items-center justify-center gap-4 text-zinc-600">
              <div className="h-px w-8 bg-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Ecosystem Layers</span>
              <div className="h-px w-8 bg-current" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">OUR CORE SOLUTIONS</h2>
            <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto leading-relaxed">
              We abstract the friction away so you can focus on building <br className="hidden md:block" /> what actually matters.
            </p>
          </div>

          <div className="space-y-40">
            {/* Core 01 - Content Left, Image Right */}
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10 order-1">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Module — 01</span>
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">Invisible <br /> Wallets</h3>
                  <p className="text-xl text-zinc-400 font-light max-w-lg leading-relaxed pt-2">
                    A non-custodial, serverless wallet experience that lives entirely in the browser. Zero friction, instant access to decentralized finance.
                  </p>
                </div>
                <div className="space-y-4 max-w-md">
                  <ProductFeature label="Non-Custodial Account (Starknet)" active />
                  <ProductFeature label="Aggregated Yield Positions" disabled />
                  <ProductFeature label="Automated Market Execution" disabled />
                </div>
              </div>
              <div className="order-2 relative">
                <div className="absolute -inset-10 bg-white/[0.02] blur-[80px] rounded-full pointer-events-none" />
                <div className="relative border border-white/10 bg-black p-1 shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-700">
                  <div className="border border-white/5 bg-zinc-950/20 p-8 space-y-8">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-zinc-500">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white text-black flex items-center justify-center font-black text-xs">OTD</div>
                        <span>Mainnet Active</span>
                      </div>
                      <Settings size={14} />
                    </div>
                    <div className="space-y-3">
                      <div className="text-[11px] uppercase font-bold text-zinc-600 tracking-[0.3em]">Portfolio Value</div>
                      <div className="text-6xl font-black text-white font-mono tracking-tighter">$1,06</div>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-12 border border-white/10 flex items-center justify-center text-[10px] font-black uppercase text-white hover:bg-white/5 cursor-pointer transition-colors">Send</div>
                      <div className="h-12 border border-white/10 flex items-center justify-center text-[10px] font-black uppercase text-white hover:bg-white/5 cursor-pointer transition-colors">Receive</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core 02 - Content Right, Image Left */}
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1 relative">
                <div className="absolute -inset-10 bg-white/[0.02] blur-[80px] rounded-full pointer-events-none" />
                <div className="relative border border-white/10 bg-black p-8 shadow-2xl -skew-y-1 hover:skew-y-0 transition-transform duration-700">
                  <div className="space-y-6">
                    <div className="flex gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                    </div>
                    <div className="font-mono text-sm text-zinc-400 space-y-4">
                      <div className="text-emerald-500/80">import &#123; DoorzSDK &#125; from "@openthedoorz/sdk";</div>
                      <div className="space-y-1">
                        <div>const sdk = new DoorzSDK(&#123;</div>
                        <div className="pl-6 text-blue-400/80">network: <span className="text-zinc-300">"starknet-mainnet"</span>,</div>
                        <div className="pl-6 text-blue-400/80">auth: <span className="text-zinc-300">"social-login"</span>,</div>
                        <div className="pl-6 text-blue-400/80">storage: <span className="text-zinc-300">"encrypted-cloud"</span></div>
                        <div>&#125;);</div>
                      </div>
                      <div className="text-zinc-600 italic">// Building the future of Starknet...</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-10 order-1 lg:order-2">
                <div className="space-y-4 lg:pl-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Module — 02</span>
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">Modular <br /> SDK</h3>
                  <p className="text-xl text-zinc-400 font-light max-w-lg leading-relaxed pt-2">
                    A powerful, developer-first toolkit to integrate social login and cloud storage into your Starknet apps in minutes.
                  </p>
                </div>
                <div className="space-y-4 max-w-md lg:ml-10">
                  <ProductFeature label="Social Auth Service" active />
                  <ProductFeature label="Encrypted Metadata Storage" active />
                  <ProductFeature label="High-Performance RPC Relay" active />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="py-32 px-6 border-t border-white/[0.05] bg-gradient-to-b from-black to-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 text-left">
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-zinc-600">
                  <div className="h-px w-8 bg-current" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Creators & Visionaries</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-[0.9]">Crafted by <br /> Reflecter Labs</h2>
                <p className="text-xl text-zinc-500 font-light max-w-lg leading-relaxed">
                  A boutique collective of specialized engineers and designers pushing the boundaries of the Starknet ecosystem.
                </p>
              </div>
              <a
                href="https://www.reflecterlabs.xyz"
                target="_blank"
                className="inline-flex px-12 py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-200 transition-all items-center gap-3"
              >
                Visit reflecterlabs.xyz <ChevronRight size={14} />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-zinc-950 border border-white/[0.05] relative group overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="w-full h-full border border-white/10 flex items-center justify-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Project 0{i}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-6 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-1 space-y-8">
              <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-black text-lg">OTD</div>
              <p className="text-zinc-500 text-sm font-light leading-relaxed">
                The universal high-performance serverless SDK layer for the Starknet Network.
              </p>
            </div>

            <div className="space-y-8">
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em]">Protocol</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-zinc-600">
                <li className="hover:text-white transition-colors cursor-pointer">Security Audits</li>
                <li className="hover:text-white transition-colors cursor-pointer">Gasless Engine</li>
                <li className="hover:text-white transition-colors cursor-pointer">Vesu Connector</li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em]">Developers</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-zinc-600">
                <li className="hover:text-white transition-colors cursor-pointer">Cairo Library</li>
                <li className="hover:text-white transition-colors cursor-pointer">React SDK</li>
                <li className="hover:text-white transition-colors cursor-pointer">API Keys</li>
              </ul>
            </div>

            <div className="space-y-8 flex flex-col items-end">
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.4em]">Network State</h4>
              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] font-black text-white">MAINNET STATUS</span>
                <span className="w-24 h-px bg-emerald-500/30" />
                <span className="text-[8px] font-black text-emerald-500 tracking-[0.3em]">ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/[0.05] gap-8">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">
              © 2026 OPENTHEDOORZ FOUNDATION. THE STARKNET SDK.
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-600">
              <span className="hover:text-white transition-colors cursor-pointer">GitHub</span>
              <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
              <span className="hover:text-white transition-colors cursor-pointer">Telegram</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const RoadmapStep: React.FC<{ number: string; title: string; status: string; desc: string; active?: boolean; completed?: boolean }> = ({ number, title, status, desc, active, completed }) => (
  <div className={`p-10 border transition-all duration-500 ${active ? 'border-white/20 bg-zinc-950/50 shadow-2xl' : 'border-white/[0.05] hover:border-white/10'}`}>
    <div className="flex justify-between items-start mb-8">
      <span className="text-5xl font-black text-white/20 tracking-tighter leading-none">{number}</span>
      {completed && <CheckCircle2 size={16} className="text-emerald-500" />}
      {active && <CircleDot size={16} className="text-white animate-pulse" />}
    </div>
    <div className={`text-[9px] font-black uppercase tracking-[0.2em] mb-3 ${completed ? 'text-emerald-500' : active ? 'text-white' : 'text-zinc-600'}`}>
      {status}
    </div>
    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">{title}</h3>
    <p className="text-xs text-zinc-500 font-light leading-relaxed">{desc}</p>
  </div>
);

const ProductFeature: React.FC<{ label: string; disabled?: boolean; active?: boolean }> = ({ label, disabled, active }) => (
  <div className={`flex items-center gap-4 p-4 border transition-all duration-300 ${disabled ? 'border-white/[0.03] opacity-30 grayscale' : 'border-white/10 bg-white/[0.01] hover:bg-white/5 hover:border-white/20'}`}>
    <div className={`w-1.5 h-1.5 rounded-none ${disabled ? 'bg-zinc-700' : active ? 'bg-white' : 'border border-white/50'}`}></div>
    <div className="flex flex-col">
      <span className="text-[10px] font-black uppercase tracking-widest text-white">{label}</span>
      {active && label.includes("Non-Custodial") && (
        <span className="text-[7px] text-emerald-500 font-bold uppercase tracking-widest mt-0.5">Production Ready</span>
      )}
    </div>
    {disabled && <span className="ml-auto text-[7px] font-black uppercase tracking-[0.3em] text-zinc-700 bg-white/5 px-2 py-1">Under Dev</span>}
    {active && !label.includes("Non-Custodial") && <ChevronRight size={12} className="ml-auto text-zinc-500" />}
  </div>
);

export default Landing;
