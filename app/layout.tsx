import type { Metadata } from 'next';
import './globals.css';
import { ChipiClientProvider } from '@chipi-stack/nextjs';
import { NetworkProvider } from '@/lib/hooks/useNetwork.tsx';
import { WalletSessionProvider } from '@/lib/context/WalletSessionContext';

export const metadata: Metadata = {
  title: 'Reflecter Wallet | Starknet Wallet with Social Login - No Seed Phrases',
  description: 'The easiest way to use Starknet. Create your Web3 wallet in seconds with social login. Send, receive, and trade assets without seed phrases. Live on mainnet.',
  keywords: ['Starknet wallet', 'Web3 wallet', 'social login wallet', 'no seed phrase', 'Cairo wallet', 'Layer 2 wallet', 'Reflecter Wallet'],
  authors: [{ name: 'Reflecter Labs' }],
  openGraph: {
    title: 'Reflecter Wallet | Starknet Wallet with Social Login - No Seed Phrases',
    description: 'Your Starknet Wallet Without Seed Phrases. Social login onboarding, full DeFi access, Starknet native.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChipiClientProvider
          apiPublicKey={process.env.NEXT_PUBLIC_CHIPI_API_KEY as string}
          alphaUrl={process.env.NEXT_PUBLIC_CHIPI_ALPHA_URL}
        >
          <NetworkProvider>
            <WalletSessionProvider>
              {children}
            </WalletSessionProvider>
          </NetworkProvider>
        </ChipiClientProvider>
      </body>
    </html>
  );
}
