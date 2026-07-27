"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Wordmark } from "@/components/layout/wordmark";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-accent/20">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2 mb-8">
          <h1>
            <Wordmark className="text-5xl text-primary" />
          </h1>
          <p className="text-muted-foreground">A betting app by Josh Robbins</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </p>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
