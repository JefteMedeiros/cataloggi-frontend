import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import type { LoginRequestDto, LoginResponseDto } from "../lib/types";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (body: LoginRequestDto) =>
      apiFetch<LoginResponseDto>("/api/login", {
        method: "POST",
        body: JSON.stringify(body),
        redirectOnUnauthorized: false,
      }),
  });
}
