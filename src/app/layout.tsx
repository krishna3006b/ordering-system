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
      <body className="bg-dark-900 min-h-screen text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
