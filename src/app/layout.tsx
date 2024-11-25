import './globals.css';

import { AppProvider } from '@/lib/context/AppContext';
import { LeftMenu } from '@/ui/LeftMenu';
import { getServerSession } from 'next-auth/next';
import { config } from '@/lib/auth';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(config);
  return (
    <html lang="en">
      {session ? (
        <AppProvider userId={session.user.id}>
          <body className="bg-gray-900 text-gray-100">
            <div className="flex h-screen">
              <LeftMenu />
              <div className="flex-grow h-full bg-gray-850 shadow-inner p-4 overflow-y-hidden">
                {children}
              </div>
            </div>
          </body>
        </AppProvider>
      ) : (
        <body className="bg-gray-900 text-gray-100">
          <div className="flex h-screen">
            <div className="flex-grow h-full bg-gray-850 shadow-inner p-4 overflow-y-hidden">
              <a href="/api/auth/signin">Please Log in</a>
            </div>
          </div>
        </body>
      )}
    </html>
  );
}
