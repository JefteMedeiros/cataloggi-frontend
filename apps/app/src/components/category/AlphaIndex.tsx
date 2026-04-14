import { cn } from '@/lib/utils';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface AlphaIndexProps {
  availableLetters: Set<string>;
  activeLetter: string | null;
  onLetterClick: (letter: string) => void;
}

export function AlphaIndex({ availableLetters, activeLetter, onLetterClick }: AlphaIndexProps) {
  return (
    <nav
      aria-label="Índice alfabético"
      className="flex w-8 shrink-0 flex-col items-center gap-px py-2"
    >
      {ALPHABET.map((letter) => {
        const isAvailable = availableLetters.has(letter);
        const isActive = activeLetter === letter;

        return (
          <button
            key={letter}
            onClick={() => isAvailable && onLetterClick(letter)}
            disabled={!isAvailable}
            aria-label={`Ir para ${letter}`}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-semibold tracking-wider transition-colors duration-100 select-none',
              isActive && 'bg-foreground text-background',
              !isActive && isAvailable && 'text-foreground hover:bg-muted cursor-pointer',
              !isAvailable && 'cursor-default text-border',
            )}
          >
            {letter}
          </button>
        );
      })}
    </nav>
  );
}
