import { Metadata } from "next";
import { redirect } from "next/navigation";

import { BLOG_TITLE, BLOG_URL } from "@/components/constants";

export default function Playground() {
  redirect("/");
}

export const metadata: Metadata = {
  title: "playground",
  openGraph: {
    title: "playground",
    type: "website",
    url: `${BLOG_URL}/playground`,
    siteName: BLOG_TITLE,
  },
  alternates: {
    canonical: `${BLOG_URL}/playground`,
  },
};
