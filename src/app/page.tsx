"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      frontend-chat practice
      <button
        className="border rounded-md"
        onClick={() => router.push("/test")}
      >
        chating page로 가기
      </button>
    </main>
  );
}
