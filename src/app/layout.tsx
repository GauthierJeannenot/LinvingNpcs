'use client';
import { useIsSmallScreen } from '@/lib/utils/useIsSmallScreen';
import './globals.css';
import { useState } from 'react';
import Image from 'next/image';
import { npcs } from '@/lib/data/npc';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const isSmallScreen = useIsSmallScreen();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100">
        <div className="flex h-screen">
          {!isSmallScreen && (
            <div
              className={`${
                isMenuOpen ? 'w-3/12' : 'w-16'
              } h-full bg-gradient-to-b from-gray-800 to-gray-700 shadow-lg p-4 transition-all duration-300 ease-in-out`}
            >
              <button
                className="text-white mb-2 focus:outline-none"
                onClick={toggleMenu}
              >
                {isMenuOpen ? '←' : '☰'}
              </button>
              {isMenuOpen && (
                <div>
                  <h1 className="text-gray-100 font-bold text-2xl mb-2">
                    Menu
                  </h1>
                  <ul className="space-y-2">
                    {npcs.map((npc) => (
                      <li key={npc.name}>
                        <a
                          href={npc.name}
                          className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg transition-all"
                        >
                          <Image
                            src={npc.picture}
                            alt={npc.name}
                            className="rounded-full object-cover"
                            width={48}
                            height={48}
                          />
                          <span className="text-gray-300 hover:text-white">
                            {npc.name}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex-grow h-full bg-gray-850 shadow-inner p-4 overflow-y-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
