import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from './components/Header';
import ClientLayout from './components/ClientLayout';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Financial Health Quiz",
  description: "Discover your financial health score and get personalized recommendations to improve your financial well-being.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={inter.className} 
        style={{ background: '#fff', color: '#000' }}
        suppressHydrationWarning={true}
      >
        <ClientLayout>
          <Header />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
