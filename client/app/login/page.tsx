import React, { Suspense } from "react";
import LoginForm from "../../components/login/login-form";

export const metadata = {
  title: "Login - Potzi",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[-100px_100px] [background-size:4px_4px]"></div>
      <Suspense fallback={<div className="text-zinc-400">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
