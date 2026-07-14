import { cn } from "@/lib/utils";
import type { ItemDetail } from "@/lib/types";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface AlphaIndexProps {
  items: ItemDetail[];
}

export function AlphaIndex({ items }: AlphaIndexProps) {
  const availableLetters = new Set(
    items.map((item) => item.firstLetter?.toUpperCase()).filter(Boolean),
  );

  return (
    <nav
      aria-label="Índice alfabético"
      className="flex w-8 shrink-0 flex-col items-center gap-px py-2"
    >
      {ALPHABET.map((letter) => {
        const hasItems = availableLetters.has(letter);

        return (
          <button
            key={letter}
            disabled={!hasItems}
            aria-label={`Ir para ${letter}`}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-semibold tracking-wider transition-colors duration-100 select-none",
              hasItems
                ? "cursor-pointer text-foreground hover:bg-muted"
                : "cursor-default text-border",
            )}
          >
            {letter}
          </button>
        );
      })}
    </nav>
  );
}
