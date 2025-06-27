import React from 'react';
import Link from 'next/link';

interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface AppLayoutProps {
  children: React.ReactNode;
  navigationItems?: NavigationItem[];
}

export default function AppLayout({
  children,
  navigationItems,
}: AppLayoutProps) {
  return (
    <div>
      {/* Navegación principal personalizada */}
      <nav className="border-b mb-8 bg-white/80 backdrop-blur sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
          {/* Branding/logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-blue-700 hover:text-blue-900 transition"
          >
            <span role="img" aria-label="logo">
              🥨
            </span>{' '}
            Ochío Club
          </Link>
          {/* Menú de navegación */}
          <ul className="flex gap-6">
            {navigationItems?.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`px-2 py-1 rounded transition font-medium ${item.isActive ? 'text-blue-700 bg-blue-100' : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'}`}
                  aria-current={item.isActive ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {/* Contenido principal */}
      <main className="min-h-[70vh]">{children}</main>
    </div>
  );
}
