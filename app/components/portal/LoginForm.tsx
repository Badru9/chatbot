"use client";

import { Button, Input, Label, toast } from "@heroui/react";
import React, { useState } from "react";
import { useLogin } from "../../../lib/auth-client";
import { LoginSchema } from "../../../lib/schemas/auth";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useLogin();

  const handleDemoAccount = () => {
    setEmail("dosen@mb.ai");
    setPassword("password123");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = LoginSchema.safeParse({ email, password });
    if (!validation.success) {
      toast(validation.error.issues[0]?.message || "Input tidak valid.", {
        variant: "danger",
      });
      return;
    }

    console.log("validation", validation);

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
        onError: (err: any) => {
          const message =
            err.response?.data?.error ||
            "Login gagal. Periksa kembali email dan password Anda.";
          toast(message, { variant: "danger" });
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-fit p-6 flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1 mb-2 space-y-2">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Masuk ke mb.ai
        </h2>
        <p className="text-sm text-neutral-500">
          Gunakan{" "}
          <Button
            onPress={handleDemoAccount}
            size="sm"
            variant="outline"
            className="font-semibold mx-2"
          >
            Akun Demo
          </Button>{" "}
          untuk menggunakan fitur ini.
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
        isDisabled={loginMutation.isPending}
        className="w-full py-6 mt-2 font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 rounded-xl transition"
      >
        {loginMutation.isPending ? "Memproses..." : "Masuk"}
      </Button>
    </form>
  );
}
