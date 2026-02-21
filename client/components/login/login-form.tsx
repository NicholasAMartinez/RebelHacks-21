"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";

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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(searchParams.get("error"));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage("Please fill email and password.");
      return;
    }

    if (mode === "register" && password !== confirm) {
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
          mode,
          email,
          password,
          username: mode === "register" ? username : undefined,
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
    <div className={styles.authContainer}>
      <div className={styles.brand}>Vegas Swap</div>
      <div className={styles.sub}>Community item marketplace and pool — sign in</div>

      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${mode === "login" ? styles.active : ""}`}
          onClick={() => setMode("login")}
        >
          Sign in
        </div>
        <div
          className={`${styles.tab} ${mode === "register" ? styles.active : ""}`}
          onClick={() => setMode("register")}
        >
          Register
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {mode === "register" && (
          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your display name"
            />
          </div>
        )}

        {mode === "register" && (
          <div className={styles.field}>
            <label className={styles.label}>Confirm password</label>
            <input
              className={styles.input}
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
        )}

        <div className={styles.actions}>
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
          <button
            type="button"
            className={styles.alt}
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Need an account?" : "Have an account?"}
          </button>
        </div>

        {message && <div className={styles.note}>{message}</div>}
      </form>
    </div>
  );
}
