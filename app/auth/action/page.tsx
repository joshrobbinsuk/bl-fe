"use client";

import { Suspense } from "react";
import Link from "next/link";
import { AuthActionForm } from "@/components/auth/auth-action-form";

export default function AuthActionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-accent/20">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">BrokeLads</h1>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        <Suspense fallback={null}>
          <AuthActionForm />
        </Suspense>

        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
