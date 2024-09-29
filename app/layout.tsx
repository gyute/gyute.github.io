"use client";

import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useTheme } from "@/lib/useTheme";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme, toggleTheme } = useTheme();

  return (
    <html lang="en" className={theme === "dark" ? "dark" : ""}>
      <head>
        <title>Gyute&apos;s Blog</title>
      </head>
      <body className="lgiht-bg light-text dark-bg dark-text mx-10 my-5 sm:mx-20 sm:my-10">
        <Header theme={theme} toggleTheme={toggleTheme} />
        {children}
        <Footer />
      </body>
      {/* Google tag (gtag.js) */}
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=G-QVPPDWL1LQ`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-QVPPDWL1LQ');
          `,
        }}
      />
    </html>
  );
}
