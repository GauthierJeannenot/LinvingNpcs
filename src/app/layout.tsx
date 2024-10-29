import "./globals.css";




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-row">
          <div className="w-3/12 h-screen bg-blue-500"></div>
          <div className="w-9/12 h-screen bg-indigo-500">{children}</div>
        </div>
      </body>
    </html>
  );
}
