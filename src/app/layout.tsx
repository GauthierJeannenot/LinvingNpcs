import './globals.css';

import { AppProvider } from '@/lib/context/AppContext';
import { LeftMenu } from '@/ui/LeftMenu';
import { getServerSession } from 'next-auth/next';
import { config } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(config);
  if (!session) {
    redirect('/api/auth/signin');
  }
  return (
    <html lang="en">
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
    </html>
  );
}
