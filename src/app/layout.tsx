import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TechStore Checkout — Live Ordering System',
  description: 'Production e-commerce ordering system demo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] min-h-screen text-zinc-100 antialiased font-sans selection:bg-[#c8a951]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
