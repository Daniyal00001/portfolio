"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LiquidEther } from "@/components/liquid-ether";
import { Loader2, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";

// Supabase messages are accurate but terse; these read better without
// revealing whether an account exists.
function friendlyError(message = "") {
  if (/invalid login credentials/i.test(message)) {
    return "That email and password combination did not work. Please try again.";
  }
  if (/email not confirmed/i.test(message)) {
    return "This account still needs its email confirmed before signing in.";
  }
  if (/rate limit|too many/i.test(message)) {
    return "Too many attempts. Wait a minute before trying again.";
  }
  return message || "Something went wrong signing in. Please try again.";
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // The middleware sends ?expired=1 when a session passes the 2-day limit.
  useEffect(() => {
    if (searchParams.get("expired") === "1") {
      setError("Your session expired after 2 days. Please sign in again.");
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      setError(friendlyError(error.message));
      setLoading(false);
      return;
    }

    router.push("/mdtadmin");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <LiquidEther className="absolute inset-0 z-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>

        <Card className="border-border bg-card/90 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-3">
            <div className="flex justify-center">
              <div className="relative h-14 w-14">
                <Image
                  src="/assets/mylogo/MFI-Black.png"
                  alt="MFI"
                  fill
                  sizes="56px"
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/assets/mylogo/MFI-White.png"
                  alt="MFI"
                  fill
                  sizes="56px"
                  className="hidden object-contain dark:block"
                />
              </div>
            </div>
            <CardTitle className="text-center font-display text-2xl font-bold tracking-tight">
              Admin sign in
            </CardTitle>
            <CardDescription className="text-center">
              Manage your portfolio content and blog
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/10 text-destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full font-semibold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Private area. Authorised access only.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
