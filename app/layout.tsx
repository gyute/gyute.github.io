import "./globals.css";
import { Metadata } from "next";
import Script from "next/script";

import { BLOG_TITLE } from "@/components/constants";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setInitialTheme = `
    (function() {
      if (typeof window === "undefined") return;
      const savedTheme = localStorage.getItem("theme");
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const theme = savedTheme || systemTheme;
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    })();
  `;

  return (
    <html lang="en" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
      </head>
      <body className="light-bg light-text dark-bg dark-text mx-5 my-5 sm:mx-20">
        <Header />
        <main className="min-h-[63vh] sm:min-h-[67vh]">{children}</main>
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

export const metadata: Metadata = {
  title: BLOG_TITLE,
  openGraph: {
    type: "website",
    url: "https://gyute.com",
    siteName: BLOG_TITLE,
  },
};
