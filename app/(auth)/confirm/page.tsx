"use client";

import Link from "next/link";
import { ConfirmForm } from "@/components/auth/confirm-form";

export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-accent/20">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">BrokeLads</h1>
          <p className="text-muted-foreground">Confirm your email</p>
        </div>

        <ConfirmForm />

        <p className="text-center text-sm text-muted-foreground">
          Already confirmed?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
