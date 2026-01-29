import type { Metadata } from "next";
import { Inter, Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { NotificationProvider } from "@/components/notification/NotificationProvider";

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
  title: "Business Social Network",
  description: "Connect, share, and grow your business.",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} antialiased min-h-screen relative`}>
        {/* Animated Background Mesh */}
        <div className="bg-mesh">
          <div className="mesh-gradient h-full w-full" />
        </div>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <PopupProvider>
              <NotificationProvider>
                <ClientLayout>
                  {children}
                </ClientLayout>
              </NotificationProvider>
            </PopupProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
