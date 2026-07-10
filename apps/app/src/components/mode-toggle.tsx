import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="fixed top-3 right-3 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="icon">
              <HugeiconsIcon
                icon={Sun01Icon}
                size={18}
                className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
              />
              <HugeiconsIcon
                icon={Moon01Icon}
                size={18}
                className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
              />
              <span className="sr-only">Alternar tema</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Claro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>Escuro</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            Sistema
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
