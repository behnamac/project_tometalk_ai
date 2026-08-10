import type { Metadata } from "next";
import { IBM_Plex_Serif, IBM_Plex_Sans, Mona_Sans, Space_Grotesk } from "next/font/google";

import Navbar from "@/components/Navbar";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner";

const ibmPlexSerif = IBM_Plex_Serif({
    variable: "--font-ibm-plex-serif",
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap'
});

const monaSans = Mona_Sans({
    variable: '--font-mona-sans',
    subsets: ['latin'],
    display: 'swap'
})

// Landing page only (Geometric design identity) — scoped via .landing-dark in globals.css
const spaceGrotesk = Space_Grotesk({
    variable: '--font-space-grotesk',
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap'
})

const ibmPlexSans = IBM_Plex_Sans({
    variable: '--font-ibm-plex-sans',
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    display: 'swap'
})

export const metadata: Metadata = {
  title: "TomeTalk",
  description: "Transform your books into interactive AI conversations. Upload PDFs, and chat with your books using voice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSerif.variable} ${monaSans.variable} ${spaceGrotesk.variable} ${ibmPlexSans.variable} relative font-sans antialiased`}
        suppressHydrationWarning
      >
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
