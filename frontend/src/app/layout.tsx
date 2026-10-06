import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { NotificationProvider } from "@/components/notification/NotificationProvider";
import { LanguageProvider } from "@/components/layout/LanguageProvider";

const inter = Inter({
  variable: "--font-primary",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MADA | شبكة الأعمال والمهنيين الموثّقة",
  description: "MADA - The Premier Verified Business & Professional Network. Connect, collaborate, and scale your enterprise.",
};

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import ClientLayout from "@/components/layout/ClientLayout";
import { PopupProvider } from "@/components/common/PopupProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} antialiased min-h-screen relative`}>
        {/* Animated Background Mesh */}
        <div className="bg-mesh">
          <div className="mesh-gradient h-full w-full" />
        </div>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <Providers>
              <PopupProvider>
                <NotificationProvider>
                  <ClientLayout>
                    {children}
                  </ClientLayout>
                </NotificationProvider>
              </PopupProvider>
            </Providers>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
