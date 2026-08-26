import type { Metadata } from "next";
import { IBM_Plex_Serif, IBM_Plex_Sans, Mona_Sans, Space_Grotesk } from "next/font/google";

import "./globals.css";
import {Toaster} from "@/components/ui/sonner";
import I18nProvider from "@/components/providers/I18nProvider";
import { getRequestLanguage } from "@/lib/i18n/server";

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

const spaceGrotesk = Space_Grotesk({
    variable: '--font-space-grotesk',
    subsets: ['latin'],
    weight: ['500', '600', '700'],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getRequestLanguage();

  return (
    <html lang={language}>
      <body
        className={`${ibmPlexSerif.variable} ${monaSans.variable} ${spaceGrotesk.variable} ${ibmPlexSans.variable} relative font-sans antialiased`}
        suppressHydrationWarning
      >
        <I18nProvider language={language}>
          {children}
        </I18nProvider>
        <Toaster />
      </body>
    </html>
  );
}
