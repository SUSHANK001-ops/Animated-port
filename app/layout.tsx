import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sushanka Lamichhane - Developer Portfolio",
  description:
    "Welcome to the portfolio of Sushanka Lamichhane, a passionate developer specializing in web and software development. Explore projects, skills, and experiences that showcase expertise in creating innovative solutions.",
  keywords: [
    "Sushanka Lamichhane",
    "developer portfolio",
    "web developer",
    "software developer",
    "full stack developer",
    "frontend developer",
    "React developer",
    "Next.js developer",
    "portfolio",
  ],
  authors: [{ name: "Sushanka Lamichhane" }],
  creator: "Sushanka Lamichhane",
  metadataBase: new URL("https://sushanka.com.np"),
  openGraph: {
    title: "Sushanka Lamichhane - Developer Portfolio",
    description:
      "Passionate developer specializing in web and software development. Explore projects, skills, and experiences.",
    url: "https://sushanka.com.np",
    siteName: "Sushanka Lamichhane Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "Sushanka Lamichhane Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sushanka Lamichhane - Developer Portfolio",
    description:
      "Passionate developer specializing in web and software development. Explore projects, skills, and experiences.",
    images: ["/profile.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="canonical" href="https://sushanka.com.np" />
        <meta name="theme-color" content="#1A1A1A" />
        <meta name="color-scheme" content="dark" />
      </head>

      <body
        className={`${spaceGrotesk.variable} ${notoSansDevanagari.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
