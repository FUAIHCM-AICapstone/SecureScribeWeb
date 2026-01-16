
// app/layout.tsx
import { Insights } from './insights';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true} className="bg-[var(--background-color)] text-[var(--text-color)]">
      <head>
        {/* Network optimization hints for faster resource loading */}
        <link rel="preconnect" href="https://www.gstatic.com" />
        <link rel="preconnect" href="https://www.googleapis.com" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
        <link rel="dns-prefetch" href="https://fcm.googleapis.com" />
        <link rel="dns-prefetch" href="https://messaging-service-publicapi.googleapis.com" />
        
        <script async src="/env-config.js"></script>
      </head>
      <body style={{ fontFamily: 'var(--font-family-base)' }}>
        {children}
        <Insights />
      </body>
    </html>
  );
}