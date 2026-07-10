import { AppRouter } from "@/router";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme-app">
      <AppRouter />
      <ModeToggle />
      <InstallAppButton />
    </ThemeProvider>
  );
}
