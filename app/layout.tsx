import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from './components/Header';
import ClientLayout from './components/ClientLayout';
import ConditionalHeaderLayout from './components/ConditionalHeaderLayout';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dolphin Finance",
  description: "Discover your financial health score and get personalized recommendations to improve your financial well-being.",
  icons: {
    icon: '/assets/Dolphin Finance Logo Icon.ico',
    apple: '/assets/Dolphin Finance Logo Icon.ico',
  },
  manifest: '/manifest.json',
  themeColor: '#0058C0',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={inter.className} 
        style={{ background: '#fff', color: '#000' }}
        suppressHydrationWarning={true}
      >
        <ConditionalHeaderLayout>{children}</ConditionalHeaderLayout>
        <Analytics />
      </body>
    </html>
  );
}
