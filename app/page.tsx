"use client";
import { signOut } from "next-auth/react";
import LoginButton from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

import { Poppins } from "next/font/google";
import Link from "next/link";
import { use, useEffect } from "react";
const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  const { data } = useSession();

  const session = data;

  const handleSignOut = () => {

    signOut();
  };

  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900 to-black">
      <div className="space-y-6">
        <h1
          className={cn(
            "text-6xl font-semibold  text-white drop-shadow-md",
            font.className
          )}
        >
          🔐 Auth
        </h1>
        <p className=" text-white  text-lg ">A Simple Authentication Service</p>
        <div className="">
          {session ? (
            <LoginButton mode="redirect" asChild>
              <Button onClick={handleSignOut} variant="secondary" size={"lg"}>
                Sign Out
              </Button>
            </LoginButton>
          ) : (
            <LoginButton mode="redirect" asChild>
              <Link href="/auth/login">
                <Button variant="secondary" size={"lg"}>
                  Sign in
                </Button>
              </Link>
            </LoginButton>
          )}
        </div>
      </div>
    </main>
  );
}
