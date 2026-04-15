import { AppRouter } from "./router";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme-dashboard">
      <AppRouter />
      <ModeToggle />
    </ThemeProvider>
  );
}
