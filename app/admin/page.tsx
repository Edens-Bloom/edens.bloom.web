"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";

export default function AdminPage() {
  const router = useRouter();
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.replace("/login");
    } else {
      router.replace("/admin/product");
    }
  }, [user, router]);

  return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      Redirecting...
    </div>
  );
}
