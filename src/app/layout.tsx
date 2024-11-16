'use client';
import { useIsSmallScreen } from '@/lib/utils/useIsmallScreen';
import './globals.css';
import { useState } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const isSmallScreen = useIsSmallScreen()
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100">
        <div className="flex h-screen">
          {!isSmallScreen && <div
            className={`${
              isMenuOpen ? 'w-3/12' : 'w-16'
            } h-full bg-gradient-to-b from-gray-800 to-gray-700 shadow-lg p-6 transition-all duration-300 ease-in-out`}
          >
            <button
              className="text-white mb-4 focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? '←' : '☰'}
            </button>
            {isMenuOpen && (
              <div>
                <h1 className="text-gray-100 font-bold text-2xl mb-4">Menu</h1>
              </div>
            )}
          </div>}

          <div className="flex-grow h-full bg-gray-850 shadow-inner p-8 overflow-y-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
