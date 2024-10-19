"use client";

import { useRouter } from "next/navigation";

export default function Playground() {
  const router = useRouter();

  router.replace("/");
}
