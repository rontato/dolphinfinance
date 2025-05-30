import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from './components/Header';
import ClientLayout from './components/ClientLayout';
import ConditionalHeaderLayout from './components/ConditionalHeaderLayout';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dolphin Finance",
  description: "Discover your financial health score and get personalized recommendations to improve your financial well-being.",
  icons: {
    icon: '/assets/DolphinFinanice Logo Icon Favicon Icon.ico',
    apple: '/assets/DolphinFinanice Logo Icon Favicon Icon.ico',
  },
  manifest: '/manifest.json',
  themeColor: '#0058C0',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Use client-side hook to get the current path
  // Only allow scrolling on /results/[id] and not on / or quiz pages
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isResultsPage = pathname.startsWith('/results/');
  const noScroll = !isResultsPage;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/assets/DolphinFinanice Logo Icon Favicon Icon.ico" type="image/x-icon" />
      </head>
      <body 
        className={inter.className}
        style={{ background: '#fff', color: '#000' }}
        suppressHydrationWarning={true}
      >
        <ConditionalHeaderLayout>{children}</ConditionalHeaderLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
