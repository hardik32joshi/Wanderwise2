import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import NavAuth from '@/components/NavAuth';

export const metadata: Metadata = {
  title: { default: 'WanderWise — Plan, Book, Travel', template: '%s | WanderWise' },
  description: 'Discover destinations, book curated travel packages, and plan your next trip with WanderWise.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-16">
            <Link href="/" className="font-display font-bold text-xl text-primary-dark">
              WanderWise
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
              <Link href="/destinations" className="hover:text-primary">Destinations</Link>
              <Link href="/packages" className="hover:text-primary">Packages</Link>
              <Link href="/dashboard" className="hover:text-primary">My Trips</Link>
            </nav>
            <NavAuth />
          </div>
        </header>
        <main className="min-h-[70vh]">{children}</main>
        <footer className="border-t border-gray-100 mt-16 py-10 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} WanderWise. Built as a real, database-backed travel platform.
        </footer>
      </body>
    </html>
  );
}
