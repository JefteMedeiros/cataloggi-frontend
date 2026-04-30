import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useLoginMutation } from "../hooks/use-auth";
import { setToken } from "../lib/auth";
import type { LoginRequestDto } from "../lib/types";

const loginSchema = z.object({
  username: z.string().trim().min(1, "O usuário é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const loginMutation = useLoginMutation();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setServerError(null);
    try {
      const body: LoginRequestDto = {
        username: values.username.trim(),
        password: values.password,
      };

      const data = await loginMutation.mutateAsync(body);

      if (!data.token) {
        throw new Error("Token ausente");
      }

      setToken(data.token, data.expiresAt);
      navigate("/items", { replace: true });
    } catch {
      setServerError("Credenciais inválidas. Tente novamente.");
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Cataloggi Admin
          </h1>
          <p className="text-sm text-muted-foreground">Entre na sua conta</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="admin"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="************"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {serverError ? (
              <p className="text-sm text-destructive">{serverError}</p>
            ) : null}

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
