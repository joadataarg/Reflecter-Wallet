import type { Metadata } from 'next';
import './globals.css';
import { ChipiClientProvider } from '@chipi-stack/nextjs';
import { NetworkProvider } from '@/lib/hooks/useNetwork.tsx';

export const metadata: Metadata = {
  title: 'Open The Doorz (OTD) | The Premium Starknet SDK',
  description: 'Open The Doorz (OTD) is the professional-grade SDK for the Starknet ecosystem. Enable gasless transactions, seamless wallet integration, and DeFi connectivity with an institutional aesthetic.',
  keywords: ['Starknet', 'SDK', 'Open The Doorz', 'OTD', 'Gasless Transactions', 'Web3', 'Blockchain', 'DeFi', 'Institutional SDK'],
  authors: [{ name: 'Reflecter Labs' }],
  openGraph: {
    title: 'Open The Doorz (OTD) | The Premium Starknet SDK',
    description: 'Professional-grade SDK for Starknet. Gasless, Fast, Secure.',
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
            {children}
          </NetworkProvider>
        </ChipiClientProvider>
      </body>
    </html>
  );
}
