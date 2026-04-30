import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://studypuff.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "StudyPuff — A cozy study app + community for students",
    template: "%s · StudyPuff"
  },
  description:
    "StudyPuff is the home for students who want to improve their performance, without burning out. Join a workshop, drop into a free livestream, or use one of our free templates.",
  icons: { icon: "/favicon-v3.png" },
  openGraph: {
    type: "website",
    siteName: "StudyPuff Academy",
    url: siteUrl,
    title: "StudyPuff — A cozy study app + community for students",
    description:
      "Workshops, livestreams, and tools for students who want to study well without burning out.",
    images: [{ url: "/studypuff-hero.png" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyPuff — A cozy study app + community for students",
    description:
      "Workshops, livestreams, and tools for students who want to study well without burning out.",
    images: ["/studypuff-hero.png"]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Quattrocento:wght@400;700&family=Trirong:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
