import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AutoMoto",
  description: "Premium Dealership Management System and High-Performance Vehicle Catalog",
  icons: {
    icon: '/icon.svg',
  }
};

export const viewport = {
  themeColor: '#FF6500',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'dark:bg-slate-800 dark:text-white border dark:border-slate-700 bg-white text-slate-900 border-slate-100 rounded-xl font-medium text-sm',
                duration: 4000,
              }}
            />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
