import { AppRouter } from "@/router";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";

export default function App() {
  return (
    <>
      <AppRouter />
      <InstallAppButton />
    </>
  );
}
