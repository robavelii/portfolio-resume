"use client";

import { signIn, getSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push("/admin");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Admin Sign In</h1>
        <Button onClick={() => signIn("google", { callbackUrl: "/admin" })}>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}