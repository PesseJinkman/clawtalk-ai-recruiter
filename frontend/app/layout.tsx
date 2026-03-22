import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Recruiter',
  description: 'Automated recruitment screening powered by OpenClaw',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
          <a href="/" className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
            AI Recruiter
          </a>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
