"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import Field from "@/app/components/form/Field";
import Input from "@/app/components/form/Input";
import Checkbox from "@/app/components/form/Checkbox";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      // TODO extract the fetch request into services/auth.ts
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          rememberMe: formData.get("rememberMe") === "true",
        }),
      });

      if (response.ok) {
        router.push("/timesheet");
      } else if (response.status === 404) {
        setEmailError("Email isn't registered.");
      } else if (response.status === 401) {
        setPasswordError("Incorrect password.");
      } else {
        setPasswordError("Something went wrong. Try again in a moment.");
      }
    } catch {
      setPasswordError(
        "Looks like our servers went on a coffee break. Try again in a moment.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="max-w-xl w-full"
      aria-label="Login form"
      noValidate
      onSubmit={handleSubmit}
    >
      <fieldset className="mb-5">
        <legend className="text-[20px] font-bold leading-[125%] text-gray-900 mb-5">
          Welcome back
        </legend>

        <div className="flex flex-col gap-5">
          <Field label="Email" error={emailError ?? undefined}>
            <Input
              name="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
              aria-required="true"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Password" error={passwordError ?? undefined}>
            <Input
              name="password"
              type="password"
              placeholder="••••••••••"
              autoComplete="current-password"
              required
              aria-required="true"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Checkbox
            label="Remember me"
            id="rememberMe"
            name="rememberMe"
            value="true"
          />
        </div>
      </fieldset>

      <Button type="submit" disabled={pending || !canSubmit}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
