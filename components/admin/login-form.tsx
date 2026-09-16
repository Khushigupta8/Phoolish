"use client";
import { useState } from "react";

export function LoginForm({ onSignedIn }: { onSignedIn: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="admin-login"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        try {
          const response = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ password }),
          });
          const data = (await response.json()) as { error?: string };
          if (!response.ok) {
            setError(data.error ?? "Could not sign you in.");
            return;
          }
          setPassword("");
          onSignedIn();
        } catch {
          setError("Could not reach the server.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <p className="eyebrow">PHOOLISH</p>
      <h1>Product admin</h1>
      <p className="admin-muted">Sign in to add and edit the things you make.</p>
      <label>
        Password
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      <button className="button full" disabled={busy || password.length === 0}>
        {busy ? "Checking…" : "Sign in"}
      </button>
      <p role="alert" className="admin-error">
        {error}
      </p>
    </form>
  );
}
