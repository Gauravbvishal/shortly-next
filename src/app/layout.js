import './globals.css';

export const metadata = {
  title: 'Shortly'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="site-header">
          <div className="container">
            <h1 className="brand">Shortly - Link Shortener</h1>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 container py-6">
          {children}
        </main>
       
      </body>
    </html>
  );
}
