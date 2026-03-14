import type { Metadata, Viewport } from 'next';
import { LanguageProvider } from '@/lib/LanguageContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'مطعم بيت الكرم | قائمة الطعام',
  description: 'استمتع بتجربة طعام أصيلة في مطعم بيت الكرم — قائمة طعام رقمية',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0f0e0c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Note: lang and dir are initially 'ar' and 'rtl', 
  // but they will be dynamically updated by LanguageProvider
  return (
    <html lang="ar" dir="rtl">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
