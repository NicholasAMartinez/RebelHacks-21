import React, { Suspense } from "react";
import LoginForm from "../../components/login/login-form";

export const metadata = {
  title: "Login - Potzi",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <Suspense fallback={<div className="text-zinc-400">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
