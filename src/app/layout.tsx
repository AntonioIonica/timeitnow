import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Background, { BackgroundProvider } from "../components/Background";
import { TaskEstimationProvider } from "@/components/contexts/TaskEstimatorContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tomatoro | AI",
  description: "Your new TO DO app with task estimator included",
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
        <TaskEstimationProvider>
          <BackgroundProvider>
            <Background />
            {children}
          </BackgroundProvider>
        </TaskEstimationProvider>
      </body>
    </html>
  );
}
