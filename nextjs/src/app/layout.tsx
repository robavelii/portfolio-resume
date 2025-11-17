import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Robel Fekadu Hailu - Senior Software Engineer & Solutions Architect",
  description: "Portfolio and resume of Robel Fekadu Hailu, a Senior Software Engineer with expertise in full-stack development, system architecture, and team collaboration.",
  keywords: ["software engineer", "solutions architect", "resume", "portfolio", "Addis Ababa"],
  authors: [{ name: "Robel Fekadu Hailu" }],
  openGraph: {
    title: "Robel Fekadu Hailu - Senior Software Engineer & Solutions Architect",
    description: "Portfolio and resume of Robel Fekadu Hailu",
    url: "https://robelfekadu.dpdns.org",
    siteName: "Robel Fekadu Hailu Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robel Fekadu Hailu - Senior Software Engineer & Solutions Architect",
    description: "Portfolio and resume of Robel Fekadu Hailu",
    creator: "@robavelii",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}