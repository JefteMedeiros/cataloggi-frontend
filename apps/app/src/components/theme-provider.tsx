import { useEffect, useState } from "react";
import { ThemeProviderContext } from "@/context/theme-context";
import type { Theme } from "@/context/theme-context";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme-app",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{
        theme,
        setTheme: (nextTheme: Theme) => {
          localStorage.setItem(storageKey, nextTheme);
          setTheme(nextTheme);
        },
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}
