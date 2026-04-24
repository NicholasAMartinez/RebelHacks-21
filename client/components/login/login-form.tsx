"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "login" | "register";

export default function LoginForm({
  initial = "login",
  onSuccess,
}: {
  initial?: Mode;
  onSuccess?: (data: any) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>(initial);
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(searchParams.get("error"));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const submittedMode = (formData.get("authMode") as Mode) || mode;
    setMode(submittedMode);

    if (submittedMode === "login" && (!identifier.trim() || !password)) {
      setMessage("Please fill username or email, and password.");
      return;
    }

    if (submittedMode === "register" && !email || !password) {
      setMessage("Please fill email and password.");
      return;
    }

    if (submittedMode === "register" && !username.trim()) {
      setMessage("Please enter a username.");
      return;
    }

    if (submittedMode === "register" && password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: submittedMode,
          identifier: submittedMode === "login" ? identifier.trim() : undefined,
          email: submittedMode === "register" ? email : undefined,
          password,
          username: submittedMode === "register" ? username.trim() : undefined,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; message?: string; error?: string; redirectTo?: string }
        | null;

      if (!response.ok || !payload?.ok) {
        setMessage(payload?.error || "Authentication failed.");
        return;
      }

      setMessage(payload.message || "Success.");
      onSuccess?.(payload);
      router.push(payload.redirectTo || "/profile");
      router.refresh();
    } catch {
      setMessage("An error occurred. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-8">
      <h1 className="text-2xl font-black tracking-tight text-white">
        Pot<span className="text-primary">zi</span>
      </h1>
      <p className="mt-1 text-sm text-zinc-400">Choose a mode, then continue.</p>

      <form onSubmit={handleSubmit} className="mt-6">
        {mode === "login" ? (
          <div>
            <label className="text-sm font-medium text-zinc-300">Username or Email</label>
            <input
              className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="your username or your.email@example.com"
            />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="text-sm font-medium text-zinc-300">Username</label>
              <input
                className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your display name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-300">Email</label>
              <input
                className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
              />
            </div>
          </>
        )}

        <div className="mt-4">
          <label className="text-sm font-medium text-zinc-300">Password</label>
          <input
            className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password..."
          />
        </div>

        {mode === "register" && (
          <div className="mt-4">
            <label className="text-sm font-medium text-zinc-300">Confirm password</label>
            <input
              className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              placeholder="Confirm password..."
            />
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-70 ${
              mode === "login"
                ? "bg-primary text-white shadow-[0_0_20px_theme(color.primary/40%)] hover:bg-primary/90"
                : "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
            }`}
            type="submit"
            name="authMode"
            value="login"
            onClick={() => setMode("login")}
            disabled={loading}
          >
            {loading && mode === "login" ? "Please wait..." : "Sign in"}
          </button>
          <button
            className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-70 ${
              mode === "register"
                ? "bg-primary text-white shadow-[0_0_20px_theme(color.primary/40%)] hover:bg-primary/90"
                : "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600"
            }`}
            type="submit"
            name="authMode"
            value="register"
            onClick={() => setMode("register")}
            disabled={loading}
          >
            {loading && mode === "register" ? "Please wait..." : "Register"}
          </button>
        </div>

        {message && <div className="mt-4 text-center text-sm text-red-400">{message}</div>}
      </form>
    </div>
  );
}
