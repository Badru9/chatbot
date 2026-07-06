"use client";

import React, { SyntheticEvent, useState } from "react";
import { Input, Button, Label, toast } from "@heroui/react";
import { signIn } from "../../../lib/auth-client";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    signIn
      .email({ email, password })
      .then(({ error }) => {
        if (error) {
          toast(
            error.message ||
              "Login gagal. Periksa kembali email dan password Anda.",
            {
              variant: "danger",
            },
          );
        } else {
          onSuccess?.();
        }
      })
      .catch(() => {
        toast("Terjadi kesalahan jaringan.", {
          variant: "danger",
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-fit p-6 bg-white dark:bg-neutral-900 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Masuk ke mb.ai
        </h2>
        <p className="text-sm text-neutral-500">
          Gunakan akun dosen atau admin Anda untuk membuka AI Assistant.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          type="email"
          id="login-email"
          variant="secondary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-password">Password</Label>
        <Input
          type="password"
          id="login-password"
          variant="secondary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        isDisabled={isLoading}
        className="w-full py-6 mt-2 font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 rounded-xl transition"
      >
        {isLoading ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
