"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SignupForm } from "@/components/auth/signup-form";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";

export default function SignupPage() {
  const { user, loading, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && user && !signingOut) {
      setSigningOut(true);
      void signOut().finally(() => setSigningOut(false));
    }
  }, [loading, user, signingOut, signOut]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-accent/20">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">BrokeLads</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        {loading || signingOut ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Spinner />
            {signingOut ? "Signing out..." : "Checking your session..."}
          </div>
        ) : (
          <>
            <SignupForm />

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
