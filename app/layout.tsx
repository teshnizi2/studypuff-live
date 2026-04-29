import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyPuff — Learn science-based study techniques",
  description:
    "Research-backed workshops that teach you how to focus, improve grades, manage time, and study without burning out.",
  icons: { icon: "/favicon-v3.png" }
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
