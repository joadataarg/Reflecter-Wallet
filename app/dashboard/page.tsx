'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import { useFetchWallet } from '@/lib/hooks/useFetchWallet';
import {
  LogOut, Plus, Search, Building2, UploadCloud,
  LayoutGrid, Activity, Zap, Receipt, ArrowLeftRight,
  Key, Shield, Webhook, Mail, Check, Copy, Eye, EyeOff, TrendingUp, Sparkles, Globe, Info
} from 'lucide-react';
import WalletPopup from '@/app/components/WalletPopup';
import { BotsTradingOrchestrator } from '@/app/components/BotsTradingOrchestrator';
import { VesuExplorer } from '@/app/components/VesuExplorer';
import { VesuEarnAction } from '@/app/components/VesuEarnAction';
import { VesuBorrowAction } from '@/app/components/VesuBorrowAction';
import { VesuMultiplyAction } from '@/app/components/VesuMultiplyAction';
import Image from 'next/image';

// --- TYPES ---
type DashboardView =
  // General
  | 'apps' | 'metrics'
  // Chipi Products
  | 'gasless' | 'bill-payments' | 'mex-ramp'
  // Developers
  | 'api-keys' | 'jwks' | 'webhooks' | 'email-notifications';

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
}

export default function DashboardPage() {
  const { user, loading, signOut } = useFirebaseAuth();
  const { wallet } = useFetchWallet();
  const router = useRouter();

  // --- STATE ---
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>('apps');
  const [isExiting, setIsExiting] = useState(false);
  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  // Authentication Check
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      setIsExiting(true);
      await signOut();
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  // --- RENDER FLOWS ---

  if (loading || !user || isExiting) return <LoadingScreen isExiting={isExiting} />;

  // FLOW 1: ORGANIZATION SELECTION (Entry Point)
  if (!activeOrg) {
    if (isCreatingOrg) {
      return <CreateOrgScreen onCancel={() => setIsCreatingOrg(false)} onComplete={(org) => {
        setOrganizations([...organizations, org]);
        setActiveOrg(org);
      }} />;
    }
    return <SelectOrgScreen 
      onCreate={() => setIsCreatingOrg(true)} 
      onSelect={(org) => {
        setOrganizations([org]);
        setActiveOrg(org);
      }} 
      userEmail={user.email} 
    />;
  }

  // FLOW 2: MAIN DASHBOARD (Console)
  return (
    <div className="h-screen bg-black text-white selection:bg-emerald-500/30 selection:text-white flex overflow-hidden font-sans">

      {/* SIDEBAR */}
      <aside className="w-20 lg:w-64 border-r border-white/10 flex flex-col bg-zinc-950 shrink-0 z-20">

        {/* Org Header */}
        <div className="p-4 border-b border-white/10 relative">
          <button
            onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
            className="w-full flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer p-2 rounded group"
          >
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-xs uppercase shadow-lg shadow-emerald-900/20">
              {activeOrg.name.charAt(0)}
            </div>
            <div className="hidden lg:block overflow-hidden flex-1 text-left">
              <div className="text-xs font-bold text-white truncate">{activeOrg.name}</div>
              <div className="text-[9px] text-zinc-500 font-mono truncate">{activeOrg.slug}</div>
            </div>
            <div className="hidden lg:block text-zinc-500 group-hover:text-white transition-colors">
              <svg className={`w-4 h-4 transition-transform ${isOrgMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </button>

          {/* Organization Dropdown Menu */}
          {isOrgMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-white/10 rounded-lg z-50">
              <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      setActiveOrg(org);
                      setIsOrgMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      activeOrg.id === org.id
                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{org.name}</div>
                    <div className="text-[9px] text-zinc-500">{org.slug}</div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => {
                  setIsOrgMenuOpen(false);
                  setIsCreatingOrg(true);
                }}
                className="w-full border-t border-white/10 px-3 py-3 hover:bg-white/5 transition-colors flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest"
              >
                <Plus size={14} />
                Create Organization
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">

          {/* 1. General */}
          <div className="space-y-1">
            <NavHeader label="General" />
            <NavItem active={activeView === 'apps'} onClick={() => setActiveView('apps')} icon={<LayoutGrid size={16} />} label="Apps" />
            <NavItem active={activeView === 'metrics'} onClick={() => setActiveView('metrics')} icon={<Activity size={16} />} label="Metrics" />
          </div>

          {/* 2. Products */}
          <div className="space-y-1">
            <NavHeader label="Products" />
            <NavItem active={activeView === 'gasless'} onClick={() => setActiveView('gasless')} icon={<TrendingUp size={16} className="text-emerald-500" />} label="Lending" />
            <NavItem active={activeView === 'bill-payments'} onClick={() => setActiveView('bill-payments')} icon={<Sparkles size={16} className="text-purple-400" />} label="Bots Trading" />
          </div>

          {/* 3. Developers */}
          <div className="space-y-1">
            <NavHeader label="Developers" />
            <NavItem active={activeView === 'api-keys'} onClick={() => setActiveView('api-keys')} icon={<Key size={16} />} label="API Keys" />
            <NavItem active={activeView === 'jwks'} onClick={() => setActiveView('jwks')} icon={<Shield size={16} />} label="JWKS Endpoint" />
            <NavItem active={activeView === 'webhooks'} onClick={() => setActiveView('webhooks')} icon={<Webhook size={16} />} label="Webhook" />
            <NavItem active={activeView === 'email-notifications'} onClick={() => setActiveView('email-notifications')} icon={<Mail size={16} />} label="Email Notifications" />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button onClick={handleSignOut} className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
            <LogOut size={14} />
            <span className="hidden lg:block">Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto bg-black p-8 lg:p-12 relative scrollbar-hide">
        <div className="max-w-5xl mx-auto pb-20">
          {activeView === 'apps' && <AppsView />}
          {activeView === 'metrics' && <MetricsView />}

          {activeView === 'gasless' && <LendingView />}
          {activeView === 'bill-payments' && <BotsTradingView />}

          {activeView === 'api-keys' && <ApiKeysView orgId={activeOrg.id} />}
          {activeView === 'jwks' && <JwksView />}
          {activeView === 'webhooks' && <ProductPlaceholder title="Webhooks" description="Listen to real-time blockchain events." />}
        </div>
      </main>

      {/* RIGHT PANEL: CORE WALLET */}
      <aside className="w-[400px] bg-black hidden xl:block shrink-0 relative border-l border-white/10">
        <WalletPopup isOpen={true} onClose={() => { }} isEmbedded={true} />
      </aside>

    </div>
  );
}


// ============================================================================
// COMPONENT: ORGANIZATION SELECTION (Entry Point) - DARK MODE
// ============================================================================

function SelectOrgScreen({ onCreate, onSelect, userEmail }: { onCreate: () => void, onSelect: (org: Organization) => void, userEmail: string | null }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="bg-zinc-950 border border-white/10 rounded-xl w-full max-w-md overflow-hidden relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl shadow-black">
        <div className="p-8 text-center border-b border-white/5">
          <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-black text-sm mx-auto mb-6 rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.2)]">OTD</div>
          <h1 className="text-xl font-bold text-white mb-2 tracking-tight">Welcome back</h1>
          <p className="text-zinc-500 text-xs font-mono">{userEmail}</p>
        </div>

        <div className="p-4">
          <div className="p-4 mb-4">
            <h2 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] text-center mb-6">Select Organization</h2>

            <div className="space-y-2">
              {/* Create Button */}
              <button onClick={onCreate} className="w-full text-left p-4 hover:bg-white/5 border border-dashed border-white/10 hover:border-white/20 rounded-lg flex items-center gap-4 transition-all group">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
                  <Plus size={18} />
                </div>
                <div>
                  <span className="block text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">Create New Organization</span>
                  <span className="text-[10px] text-zinc-600">Start a new workspace</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreateOrgScreen({ onCancel, onComplete }: { onCancel: () => void, onComplete: (org: Organization) => void }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const handleSubmit = () => {
    onComplete({
      id: `org_${Math.random().toString(36).substr(2, 9)}`,
      name: name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      role: 'OWNER'
    });
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
      <div className="bg-zinc-950 border border-white/10 rounded-xl w-full max-w-md overflow-hidden relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl">
        <div className="p-8 pb-0">
          <h1 className="text-xl font-black text-white uppercase tracking-wider mb-8">Create Organization</h1>

          {/* Logo Upload */}
          <div className="mb-8">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3">Workspace Logo</label>
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-lg border border-dashed border-white/20 flex items-center justify-center bg-black hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors cursor-pointer group">
                <UploadCloud size={24} className="text-zinc-600 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="flex flex-col justify-center gap-2">
                <button className="px-5 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors">Upload Image</button>
                <span className="text-[10px] text-zinc-600">Recommended 1:1, up to 10MB.</span>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Organization Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Reflecter Labs"
              className="w-full p-4 bg-black border border-white/10 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors placeholder:text-zinc-800"
              autoFocus
            />
          </div>

          {/* Slug */}
          <div className="mb-8">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">URL Slug</label>
            <div className="flex items-center bg-black border border-white/10 p-4 opacity-70 focus-within:opacity-100 transition-opacity focus-within:border-emerald-500">
              <span className="text-zinc-600 text-xs font-mono mr-2">console.otd.com/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={name ? name.toLowerCase().replace(/\s+/g, '-') : 'my-org'}
                className="bg-transparent text-sm text-white focus:outline-none w-full font-mono"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-black/50 border-t border-white/5 flex items-center justify-end gap-4">
          <button onClick={onCancel} className="px-4 py-2 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!name}
            className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Organization
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPONENT: VIEWS (Console Content)
// ============================================================================

// 1. APPS VIEW (Registry from previous iteration, simplified)
function AppsView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Applications</h2>
          <p className="text-zinc-500 text-sm">Manage your deployed instances.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors rounded-sm">
          <Plus size={14} /> New App
        </button>
      </header>

      {/* Empty State */}
      <div className="border border-dashed border-white/10 rounded-lg p-12 flex flex-col items-center justify-center text-center bg-white/[0.02]">
        <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-zinc-600">
          <LayoutGrid size={20} />
        </div>
        <h3 className="text-white font-bold mb-1">No applications found</h3>
        <p className="text-zinc-500 text-xs mb-6">Get started by creating your first app.</p>
        <div className="px-6 py-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md text-xs font-mono">
          npm run chipi:deploy
        </div>
      </div>
    </div>
  )
}

// 2. METRICS VIEW
function MetricsView() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-white mb-2">Metrics</h2>
        <p className="text-zinc-500 text-sm">Real-time usage statistics.</p>
      </header>
      <div className="border border-dashed border-white/10 rounded-lg p-12 text-center bg-white/[0.02]">
        <p className="text-zinc-500 text-xs">Waiting for wallet activity...</p>
      </div>
    </div>
  )
}

// 3. API KEYS VIEW (Matching Screenshot)
function ApiKeysView({ orgId }: { orgId: string }) {
  // Generate simulated stable keys based on orgId
  const prodKey = `pk_prod_${orgId.substr(4)}_${Math.random().toString(36).substr(2, 16)}`;
  const devKey = `pk_test_${orgId.substr(4)}_${Math.random().toString(36).substr(2, 16)}`;

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-white mb-2">API keys</h2>
        <p className="text-zinc-400 text-sm">Manage your API keys for authentication and identification.</p>
      </header>

      {/* Quick Copy Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Quick Copy</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-black rounded-sm text-[10px] font-bold uppercase hover:bg-zinc-200">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            Next.js
          </button>
        </div>
        <p className="text-xs text-zinc-500 mb-3">Choose your framework and paste the code into your environment file.</p>

        <div className="bg-[#0D0D0D] border border-white/10 rounded-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
            <span className="text-[10px] text-zinc-500 font-mono">.env</span>
            <div className="flex gap-3 text-zinc-500">
              <Eye size={14} className="hover:text-white cursor-pointer" />
              <Copy size={14} className="hover:text-white cursor-pointer" />
            </div>
          </div>
          <div className="p-4 font-mono text-[11px] leading-relaxed text-zinc-300">
            <div>NEXT_PUBLIC_CHIPI_API_KEY={prodKey}</div>
            <div className="text-zinc-600">CHIPI_SECRET_KEY=sk_prod_••••••••••••••••••••••••••••</div>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/10 w-full mb-8"></div>

      {/* Keys Detail */}
      <div className="space-y-8">
        {/* Public */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Public Key</h3>
            <Copy size={14} className="text-zinc-500 hover:text-white cursor-pointer" />
          </div>
          <p className="text-xs text-zinc-500 mb-3">This key should be used in your frontend code. It can be safely shared.</p>
          <div className="w-full bg-white text-black p-3 rounded-md font-mono text-xs border border-transparent focus:border-emerald-500 outline-none">
            {prodKey}
          </div>
        </div>

        {/* Secret */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Secret Key</h3>
            <div className="flex gap-3 text-zinc-500">
              <Eye size={14} className="hover:text-white cursor-pointer" />
              <Copy size={14} className="hover:text-white cursor-pointer" />
            </div>
          </div>
          <p className="text-xs text-zinc-500 mb-3">Securely manage these sensitive keys. Do not share them with anyone.</p>
          <div className="w-full bg-[#111] text-zinc-500 p-3 rounded-md font-mono text-xs border border-white/10 flex items-center justify-between group">
            <span>sk_prod_••••••••••••••••••••••••••••••••••</span>
          </div>
        </div>
      </div>

    </div>
  )
}

// 4. JWKS VIEW
function JwksView() {
  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-white mb-2">JWKS Configuration</h2>
        <p className="text-zinc-400 text-sm">Configure your JWKS endpoint and JWT validation rules.</p>
      </header>

      <div className="space-y-8">
        <div>
          <label className="text-xs font-bold text-zinc-300 mb-2 block">Auth Provider</label>
          <div className="p-3 bg-zinc-900 border border-white/10 rounded-md text-xs text-white flex items-center gap-2">
            <span className="text-yellow-500">🔥</span> Firebase
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-300 mb-2 block">JWKS Endpoint URL</label>
          <input type="text" readOnly value="https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com" className="w-full p-3 bg-black border border-white/10 rounded-md text-xs text-zinc-400 font-mono" />
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-300 mb-2 block">User Identifier</label>
          <div className="p-3 bg-white text-black border border-white/10 rounded-md text-xs font-bold">sub</div>
          <p className="text-[10px] text-zinc-600 mt-1">The ID that will be used to identify the user.</p>
        </div>

        <div className="pt-4 flex justify-end">
          <button className="px-6 py-2 bg-emerald-500 text-black font-bold uppercase text-xs rounded-sm hover:bg-emerald-400">Save Changes</button>
        </div>
      </div>
    </div>
  )
}

// 5. PRODUCT PLACEHOLDER (Gasless, etc.)
function ProductPlaceholder({ title, description }: { title: string, description: string }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-white mb-2">{title}</h2>
        <p className="text-zinc-400 text-sm mb-6">{description}</p>

        {title === 'Gasless' && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-3">
            <Zap size={20} className="text-emerald-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Quickstart Guide</h4>
              <p className="text-xs text-zinc-400 mb-3">Follow our documentation to integrate Gasless transactions in minutes.</p>
              <button className="text-emerald-500 text-xs font-bold uppercase tracking-widest hover:underline">View Guide &rarr;</button>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}

// ----------------------------------------------------------------------------
// UTILS
// ----------------------------------------------------------------------------

function NavHeader({ label }: { label: string }) {
  return <div className="px-3 pt-6 pb-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{label}</div>
}

function NavItem({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-xs font-medium
            ${active ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}
            `}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function LoadingScreen({ isExiting }: { isExiting: boolean }) {
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
          {isExiting ? 'Signing Out...' : 'Loading Console...'}
        </div>
      </div>
    </div>
  )
}
// ============================================================================
// COMPONENT: Lending View - Dashboard Configuration
// ============================================================================
// ============================================================================
// COMPONENT: Lending View - Dashboard Configuration
// ============================================================================
function LendingView() {
  const [userRole] = useState<'admin' | 'developer' | 'user'>('admin'); // TODO: Get from user context

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="space-y-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Lending Configuration</h1>
          <p className="text-zinc-400 text-sm">
            {userRole === 'admin' 
              ? 'Configure Vesu Protocol pools and enable lending features for your users. Only admins can create pools.'
              : 'View Vesu Protocol pools. Contact system admin to create new pools.'}
          </p>
        </div>
      </div>

      {/* VesuExplorer - Full implementation */}
      <div className="flex-1 overflow-hidden">
        <VesuExplorerDashboard isAdmin={userRole === 'admin'} />
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT: VesuExplorer Dashboard - Adapted version for dashboard with admin controls
// ============================================================================
function VesuExplorerDashboard({ isAdmin }: { isAdmin: boolean }) {
  const [activeTab, setActiveTab] = useState<'Earn' | 'Borrow' | 'Multiply' | 'Vaults'>('Earn');
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [view, setView] = useState<'list' | 'details' | 'action'>('list');

  const tabs = ['Earn', 'Borrow', 'Multiply', 'Vaults'] as const;

  const MOCK_POOLS = [
    {
      id: 'wsteth-prime',
      type: 'Earn',
      name: 'Wrapped Staked Ether',
      symbol: 'wstETH',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      totalSupplied: '$4.87M',
      apr: '3.25%',
      utilization: '7.08%',
      collateral: [
        { asset: 'WBTC', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', lltv: '80%', price: '$89.62K', debtCap: '50M wstETH' },
        { asset: 'USDC', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', lltv: '75%', price: '$1', debtCap: '100M wstETH' },
      ],
      addresses: {
        poolId: '0x045...c3b5',
        collateralAsset: '0x005...e38b'
      }
    },
    {
      id: 'strk-wsteth-prime',
      type: 'Borrow',
      name: 'STRK / wstETH',
      symbol: 'STRK / wstETH',
      icon: 'https://www.starknet.io/assets/starknet-logo.svg',
      collateralIcon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      liquidity: '$4.31M',
      apr: '0.72%',
      supplyApr: '4.01%',
      borrowApr: '0.72%',
      utilization: '7.08%',
      collateral: [
        { asset: 'USDC', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', lltv: '68%', price: '$1', debtCap: '10M STRK' },
      ],
      addresses: {
        poolId: '0x045...c3b5',
        collateralAsset: '0x047...938d',
        debtAsset: '0x005...e38b'
      }
    },
    {
      id: 'eth-wsteth-multiply',
      type: 'Multiply',
      name: 'ETH / wstETH',
      symbol: 'ETH / wstETH',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      collateralIcon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      liquidity: '$4.3M',
      apr: '15.05%',
      maxApr: '15.05%',
      maxMultiplier: '9.2x',
      utilization: '7.08%',
      collateral: [
        { asset: 'STRK', icon: 'https://www.starknet.io/assets/starknet-logo.svg', lltv: '70%', price: '$0.08', debtCap: '50M ETH' },
        { asset: 'WBTC', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', lltv: '80%', price: '$89.77K', debtCap: '50M ETH' },
        { asset: 'wstETH', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', lltv: '91%', price: '$3.81K', debtCap: '50M ETH' },
      ],
      addresses: {
        poolId: '0x045...c3b5',
        collateralAsset: '0x049...4dc7',
        debtAsset: '0x005...e38b'
      }
    }
  ];

  if (view === 'details' && selectedPool) {
    return (
      <div className="flex flex-col h-full p-6 space-y-6 overflow-y-auto custom-scrollbar">
        <button
          onClick={() => {
            setSelectedPool(null);
            setView('list');
          }}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors font-bold uppercase tracking-widest w-fit"
        >
          ← Back to Markets
        </button>

        {/* Pool Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center -space-x-2">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 z-10 overflow-hidden">
                <img src={selectedPool.icon} alt={selectedPool.symbol} className="w-7 h-7" />
              </div>
              {selectedPool.collateralIcon && (
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 overflow-hidden">
                  <img src={selectedPool.collateralIcon} alt="Collateral" className="w-7 h-7" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">{selectedPool.name}</h2>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                <span>Prime</span>
                <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>
                <span>Vesu Protocol</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                {selectedPool.type === 'Multiply' ? 'Max APR' : (selectedPool.type === 'Earn' ? 'Total supplied' : 'Supply APR')}
              </div>
              <div className="text-xl font-bold text-white">
                {selectedPool.type === 'Multiply' ? selectedPool.maxApr : (selectedPool.type === 'Earn' ? selectedPool.totalSupplied : selectedPool.supplyApr)}
              </div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-1">
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                {selectedPool.type === 'Multiply' ? 'Max multiplier' : (selectedPool.type === 'Earn' ? 'APR' : 'Borrow APR')}
              </div>
              <div className="text-xl font-bold text-blue-400 flex items-center gap-1">
                {selectedPool.type === 'Multiply' ? selectedPool.maxMultiplier : (selectedPool.type === 'Earn' ? selectedPool.apr : selectedPool.borrowApr)}
                <Zap size={12} className="fill-blue-400" />
              </div>
            </div>
          </div>

          {/* Collateral Table */}
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Collateral Exposure</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] uppercase tracking-widest text-zinc-500 border-b border-white/10">
                    <th className="px-4 py-3 font-bold">Asset</th>
                    <th className="px-4 py-3 font-bold">LLTV</th>
                    <th className="px-4 py-3 font-bold">Price</th>
                    <th className="px-4 py-3 font-bold">Debt Cap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {selectedPool.collateral.map((item: any, idx: number) => (
                    <tr key={idx} className="text-xs text-white hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={item.icon} alt={item.asset} className="w-4 h-4 rounded-full" />
                          <span className="font-bold">{item.asset}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{item.lltv}</td>
                      <td className="px-4 py-3 text-zinc-400">{item.price}</td>
                      <td className="px-4 py-3 text-zinc-400">{item.debtCap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interest Rate Graph */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">Interest Rate</h4>
              <div className="text-lg font-bold text-blue-400 mt-1">0.72%</div>
            </div>

            <div className="border border-white/10 rounded p-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <div className="h-40 w-full">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                      {/* Grid Lines - Horizontal */}
                      {[0, 10, 20, 30, 40, 50].map((val) => (
                        <line
                          key={`h-${val}`}
                          x1="0" y1={50 - val} x2="100" y2={50 - val}
                          stroke="white" strokeOpacity="0.03" strokeWidth="0.5"
                        />
                      ))}

                      {/* Grid Lines - Vertical */}
                      {[0, 20, 40, 60, 80, 100].map((val) => (
                        <line
                          key={`v-${val}`}
                          x1={val} y1="0" x2={val} y2="50"
                          stroke="white" strokeOpacity="0.03" strokeWidth="0.5"
                        />
                      ))}

                      {/* Kinked Interest Rate Curve */}
                      <path
                        d="M 0 48 L 80 40 L 100 5"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
                      />

                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* X Axis Labels */}
                  <div className="flex justify-between text-[7px] text-zinc-600 font-bold uppercase tracking-tight mt-2">
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                      <span key={val}>{val}%</span>
                    ))}
                  </div>
                </div>

                {/* Y Axis Labels */}
                <div className="flex flex-col justify-between text-[7px] text-zinc-600 font-bold uppercase h-40">
                  {[50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0].map((val) => (
                    <span key={val} className="text-right w-6">{val}%</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Security & Addresses */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                <Shield size={12} /> Security
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400">Audits</span>
                  <span className="text-emerald-400 font-bold">100% Coverage</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400">Status</span>
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-500 font-bold rounded text-[8px]">NORMAL</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
                <Globe size={12} /> Addresses
              </div>
              <div className="space-y-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase">Pool Id</span>
                  <span className="text-[10px] text-blue-400 font-mono cursor-pointer hover:underline">{selectedPool.addresses.poolId}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-400 font-bold uppercase">Collateral Asset</span>
                  <span className="text-[10px] text-blue-400 font-mono cursor-pointer hover:underline">{selectedPool.addresses.collateralAsset}</span>
                </div>
                {selectedPool.addresses.debtAsset && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase">Debt Asset</span>
                    <span className="text-[10px] text-blue-400 font-mono cursor-pointer hover:underline">{selectedPool.addresses.debtAsset}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Start Winning Button */}
          <button
            onClick={() => setView('action')}
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
          >
            Start Winning
          </button>
        </div>
      </div>
    );
  }

  if (view === 'action' && selectedPool) {
    if (selectedPool.type === 'Earn') {
      return (
        <VesuEarnAction
          pool={selectedPool}
          onBack={() => setView('details')}
        />
      );
    } else if (selectedPool.type === 'Borrow') {
      return (
        <VesuBorrowAction
          pool={selectedPool}
          onBack={() => setView('details')}
        />
      );
    } else if (selectedPool.type === 'Multiply') {
      return (
        <VesuMultiplyAction
          pool={selectedPool}
          onBack={() => setView('details')}
        />
      );
    }
  }

  return (
    <div className="flex flex-col h-full p-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 mb-6 shrink-0 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-bold uppercase tracking-widest pb-3 transition-all relative whitespace-nowrap ${
              activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 shrink-0">
          <div className="p-5 bg-white/5 border border-white/10 rounded-lg space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Total Supplied</div>
            <div className="text-2xl font-bold text-white">
              {activeTab === 'Vaults' ? '$92.42K' : (activeTab === 'Multiply' ? '$67.33M' : '$67.32M')}
            </div>
          </div>
          {activeTab !== 'Vaults' && (
            <>
              <div className="p-5 bg-white/5 border border-white/10 rounded-lg space-y-1">
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Total Borrowed</div>
                <div className="text-2xl font-bold text-white">$16.55M</div>
              </div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-lg space-y-1">
                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Average APY</div>
                <div className="text-2xl font-bold text-blue-400">5.24%</div>
              </div>
            </>
          )}
          {activeTab === 'Vaults' && (
            <div className="col-span-2 flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Info size={16} className="text-blue-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                This section is currently under development
              </span>
            </div>
          )}
        </div>

        {/* Pools Table */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Active Markets</h3>
          <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] uppercase tracking-widest text-zinc-500 border-b border-white/10 bg-white/5">
                  <th className="px-4 py-3 font-bold">Asset & Pool</th>
                  <th className="px-4 py-3 font-bold">Total Supplied</th>
                  <th className="px-4 py-3 font-bold">APR</th>
                  <th className="px-4 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {MOCK_POOLS.filter((p) => p.type === activeTab).length > 0 ? (
                  MOCK_POOLS.filter((p) => p.type === activeTab).map((pool) => (
                    <tr key={pool.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center -space-x-1.5">
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-zinc-900 overflow-hidden z-10">
                              <img src={pool.icon} alt={pool.symbol} className="w-5 h-5" />
                            </div>
                            {pool.collateralIcon && (
                              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-zinc-900 overflow-hidden">
                                <img src={pool.collateralIcon} alt="Collateral" className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white uppercase tracking-tight">{pool.symbol}</div>
                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Prime</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs font-bold text-white">
                        {pool.totalSupplied || pool.liquidity}
                      </td>
                      <td className="px-4 py-4 text-xs font-bold text-blue-400">{pool.apr}</td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedPool(pool);
                            setView('details');
                          }}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-xs text-zinc-500 italic uppercase tracking-widest font-bold">
                      No {activeTab} pools configured
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// COMPONENT: Bots Trading View
// ============================================================================
function BotsTradingView() {
  return <BotsTradingOrchestrator isWalletView={false} />;
}