import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import ReduxProvider from '@/providers/ReduxProvider'
import MusicProvider from '@/providers/MusicProvider'
config.autoAddCss = false


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banana Brain Trainer Game | Sharpen Your Mind",
  description: "Challenge your memory, logic, and focus with our exciting brain training games. Sharpen your mind, go bananas!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <MusicProvider>
            {children}
          </MusicProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
