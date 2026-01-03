'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import { LogOut, User, LayoutDashboard, ExternalLink, Database, TrendingUp, Layers, Github, BookOpen, Terminal, FileCode, ShieldCheck, GitBranch } from 'lucide-react';
import WalletPopup from '@/app/components/WalletPopup';
import NetworkSelector from '@/app/components/NetworkSelector';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading, signOut } = useFirebaseAuth();
  const { wallet } = useFetchWallet();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile'>('overview');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    city: '',
    province: '',
    postalCode: ''
  });

  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      setIsExiting(true);
      await signOut();
      router.push('/');
    } catch (error) {
      setIsExiting(false);
      console.error('Sign out failed:', error);
    }
  };

  if (loading || !user || isExiting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-6 relative overflow-hidden">
        {/* Decorative background for loading */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.03] blur-[150px] rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-12">
            <div className="w-24 h-24 bg-white text-black flex items-center justify-center font-black text-2xl shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-bounce">
              OTD
            </div>
            <div className="absolute -inset-4 border border-white/10 animate-[spin_4s_linear_infinite]" />
            <div className="absolute -inset-8 border border-white/5 animate-[spin_8s_linear_infinite_reverse]" />
          </div>

          <div className="space-y-4 text-center">
            <h2 className="text-xl font-black uppercase tracking-[0.6em] text-white animate-pulse">
              {isExiting ? 'Terminating Session' : 'Authenticating Node'}
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-zinc-800" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-500">
                {isExiting ? 'Securing Metadata Layer' : 'Verifying Protocol Credentials'}
              </span>
              <div className="h-px w-12 bg-zinc-800" />
            </div>
          </div>

          <div className="mt-16 flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white selection:bg-white selection:text-black flex overflow-hidden">
      {/* 1. SECCIÓN IZQUIERDA: SIDEBAR (Matching Wallet Aesthetic) */}
      <aside className="w-20 lg:w-64 border-r border-white/10 flex flex-col bg-black shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black text-xs shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.1)]">OTD</div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white hidden lg:block">System</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full p-4 border flex items-center gap-4 transition-all cursor-pointer group ${activeTab === 'overview' ? 'bg-white/5 border-white/10 text-white' : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={18} className="shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden lg:block">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full p-4 border flex items-center gap-4 transition-all cursor-pointer group ${activeTab === 'profile' ? 'bg-white/5 border-white/10 text-white' : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'}`}
          >
            <User size={18} className="shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden lg:block">Profile</span>
          </button>

          <div className="pt-4 mt-4 border-t border-white/5">
            <button
              onClick={handleSignOut}
              className="w-full p-4 text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all flex items-center gap-4 group cursor-pointer"
            >
              <LogOut size={18} className="shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden lg:block">Terminate</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* 2. SECCIÓN CENTRAL: CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto bg-black p-8 lg:p-12 border-r border-white/10 relative">
        {/* Background micro-decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.01] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl relative">
          {activeTab === 'overview' ? (
            <>
              <div className="mb-12">
                <div className="inline-flex items-center gap-3 px-3 py-1 border border-white/10 text-[9px] uppercase tracking-[0.3em] text-zinc-500 mb-8 font-bold">
                  <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                  Developer Dashboard • Quickstart
                </div>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                  <div>
                    <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] mb-6">
                      Build the <br /> <span className="text-zinc-500">Future.</span>
                    </h1>
                    <p className="text-xl text-zinc-400 font-light max-w-xl leading-relaxed">
                      Follow these steps to deploy your own instance of the OpenTheDoorz SDK and start managing decentralized assets today.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href="https://openthedoorz.gitbook.io/open-the-doorz/"
                      target="_blank"
                      className="flex items-center gap-2 px-6 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-95"
                    >
                      <BookOpen size={16} />
                      View Docs
                    </Link>
                    <Link
                      href="https://github.com/reflecterlabs/openthedoorz-sdk"
                      target="_blank"
                      className="flex items-center gap-2 px-6 py-4 bg-zinc-900 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all active:scale-95"
                    >
                      <Github size={16} />
                      GitHub Repo
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quickstart Steps */}
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white">01</div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4 flex items-center gap-3">
                    <GitBranch size={16} className="text-zinc-500" />
                    Clone Repository
                  </h3>
                  <div className="p-6 bg-zinc-950 border border-white/10 font-mono text-xs text-emerald-500 relative group">
                    <div className="absolute top-4 right-4 text-[8px] text-zinc-600 font-black uppercase tracking-widest group-hover:text-zinc-400 transition-colors">TERMINAL</div>
                    <code>git clone https://github.com/reflecterlabs/openthedoorz-sdk.git</code>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white">02</div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4 flex items-center gap-3">
                    <FileCode size={16} className="text-zinc-500" />
                    Environment Variables
                  </h3>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                    Create a Web App on Firebase and register at <Link href="https://dashboard.chipipay.com/" target="_blank" className="text-white underline font-bold">ChipiPay</Link>. <br />
                    Configure your <code className="text-white">.env.local</code> with the following keys:
                  </p>
                  <div className="p-8 bg-zinc-950 border border-white/10 font-mono text-xs text-zinc-300 relative group overflow-x-auto whitespace-pre">
                    <div className="absolute top-4 right-4 text-[8px] text-zinc-600 font-black uppercase tracking-widest group-hover:text-zinc-400 transition-colors">.ENV.LOCAL</div>
                    {`# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_APP_ID=

# ChipiPay Configuration (prod)
NEXT_PUBLIC_CHIPI_API_KEY=
CHIPI_SECRET_KEY=`}
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white">03</div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4 flex items-center gap-3">
                    <ShieldCheck size={16} className="text-zinc-500" />
                    JWT Authentication Bridge
                  </h3>
                  <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                    In ChipiPay Dashboard &gt; Developers &gt; JWKS Endpoint, configure the following sync parameters:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
                    <div className="p-6 bg-zinc-950">
                      <div className="text-[9px] uppercase tracking-widest text-zinc-600 font-black mb-4">Base Configuration</div>
                      <ul className="space-y-3">
                        <li className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Auth Provider: <span className="text-white">Firebase</span></li>
                        <li className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">User Identifier: <span className="text-white">Sub</span></li>
                        <li className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-relaxed">
                          JWKS URL: <br />
                          <span className="text-blue-400 lowercase font-mono">https://securetoken.google.com/project_id</span>
                        </li>
                      </ul>
                    </div>
                    <div className="p-6 bg-zinc-950">
                      <div className="text-[9px] uppercase tracking-widest text-zinc-600 font-black mb-4">Custom Validations (JWT)</div>
                      <div className="space-y-4">
                        <div className="p-3 bg-white/5 border border-white/10">
                          <div className="text-[8px] text-zinc-500 font-black mb-1 uppercase tracking-widest">Validation 01</div>
                          <div className="text-[10px] font-black text-white font-mono uppercase tracking-tighter">ISS / VALUE: PROJECT_ID</div>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/10">
                          <div className="text-[8px] text-zinc-500 font-black mb-1 uppercase tracking-widest">Validation 02</div>
                          <div className="text-[10px] font-black text-white font-mono uppercase tracking-tighter">AUD / VALUE: PROJECT_ID</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-12">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-emerald-500 border border-white/10 flex items-center justify-center text-[10px] font-black text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]">04</div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4 flex items-center gap-3">
                    <Terminal size={16} className="text-emerald-500" />
                    Launch Dev Environment
                  </h3>
                  <div className="p-6 bg-zinc-950 border border-white/10 font-mono text-xs text-white relative group">
                    <div className="absolute top-4 right-4 text-[8px] text-zinc-600 font-black uppercase tracking-widest group-hover:text-zinc-400 transition-colors">READY</div>
                    <div className="text-zinc-500 mb-2"># Navigate and initialize</div>
                    <div>cd openthedoorz-sdk</div>
                    <div className="text-emerald-500 mt-1 font-bold">npm run dev</div>
                  </div>
                </div>
              </div>

            </>
          ) : (
            <div className="animate-in fade-in duration-500">
              <div className="mb-12">
                <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
                  Identity <br /> <span className="text-zinc-500">Profile.</span>
                </h2>
                <p className="text-zinc-400 text-sm tracking-wide uppercase font-bold">Manage your security credentials and profile metadata.</p>
              </div>

              {/* Connectivity Stack: Each in its own row */}
              <div className="space-y-10 mb-16">
                {/* Network Section */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                    Blockchain Network
                  </h3>
                  <div className="p-1 border border-white/10 bg-zinc-950/50 flex items-center">
                    <div className="w-full">
                      <NetworkSelector />
                    </div>
                  </div>
                </div>

                {/* Explorer Activity */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                    Explorer Protocol
                  </h3>
                  <button
                    onClick={() => {
                      if (wallet?.publicKey) {
                        window.open(`https://starkscan.co/contract/${wallet.publicKey}`, '_blank');
                      }
                    }}
                    disabled={!wallet?.publicKey}
                    className="w-full flex items-center justify-between px-8 py-8 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 transition-all text-white text-[10px] uppercase tracking-[0.3em] font-black group"
                  >
                    <div className="flex items-center gap-4">
                      <ExternalLink size={20} className="text-zinc-500 group-hover:text-white transition-colors" />
                      <span>View Address Activity on Starkscan</span>
                    </div>
                    <div className="text-zinc-600 group-hover:text-white transition-colors tracking-widest font-black">OPEN_LINK</div>
                  </button>
                </div>

                {/* Active Session */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
                    Active Access Session
                  </h3>
                  <div className="p-8 bg-zinc-950/50 border border-white/10 flex items-center justify-between transition-all hover:bg-zinc-900/50">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-white text-black flex items-center justify-center font-black text-xl">
                        {user?.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xl font-black text-white uppercase tracking-tight mb-1">{user?.email}</div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Node ID: {user?.uid?.slice(0, 12).toUpperCase()} • Protocol Active</div>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/80">Authenticated</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Profile Metadata (Full Width) */}
              <div className="border-t border-white/5 pt-12">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-white mb-8 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  Identity Metadata (Off-Chain)
                </h3>
                <div className="p-10 bg-zinc-950/50 border border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div className="space-y-8 col-span-1 md:col-span-2 lg:col-span-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-black">First Name *</label>
                          <input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            placeholder="IDENTIFIER"
                            className="w-full bg-black border border-white/10 p-4 text-xs focus:border-white focus:outline-none text-white transition-colors font-bold tracking-widest uppercase"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-black">Last Name</label>
                          <input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            placeholder="SURNAME"
                            className="w-full bg-black border border-white/10 p-4 text-xs focus:border-white focus:outline-none text-white transition-colors font-bold tracking-widest uppercase"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-black">City / Region</label>
                        <input
                          type="text"
                          value={profile.city}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                          placeholder="LOCATION"
                          className="w-full bg-black border border-white/10 p-4 text-xs focus:border-white focus:outline-none text-white transition-colors font-bold tracking-widest uppercase"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-black">Province</label>
                          <input
                            type="text"
                            value={profile.province}
                            onChange={(e) => setProfile({ ...profile, province: e.target.value })}
                            placeholder="DOMAIN"
                            className="w-full bg-black border border-white/10 p-4 text-xs focus:border-white focus:outline-none text-white transition-colors font-bold tracking-widest uppercase"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-black">Postal Code</label>
                          <input
                            type="text"
                            value={profile.postalCode}
                            onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                            placeholder="ZONE"
                            className="w-full bg-black border border-white/10 p-4 text-xs focus:border-white focus:outline-none text-white transition-colors font-bold tracking-widest uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-end">
                      <div className="p-8 bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 h-full">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-zinc-500">
                          <User size={24} />
                        </div>
                        <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-500">Identity sync requires verification</p>
                        <button className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all">
                          Update Sync
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main >

      {/* 3. SECCIÓN DERECHA: WALLET POPUP EMBEBIDO */}
      < aside className="w-[420px] bg-black hidden xl:block shrink-0 relative overflow-hidden" >
        {/* Simple subtle separation line instead of heavy border */}
        < div className="absolute left-0 inset-y-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        <div className="h-full w-full">
          <WalletPopup isOpen={true} onClose={() => { }} isEmbedded={true} />
        </div>
      </aside >
    </div >
  );
}
