import { cn } from '@/lib/utils';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function AlphaIndex() {
  return (
    <nav
      aria-label="Índice alfabético"
      className="flex w-8 shrink-0 flex-col items-center gap-px py-2"
    >
      {ALPHABET.map((letter) => {
        return (
          <button
            key={letter}
            disabled
            aria-label={`Ir para ${letter}`}
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-semibold tracking-wider transition-colors duration-100 select-none',
              'cursor-default text-border',
            )}
          >
            {letter}
          </button>
        );
      })}
    </nav>
  );
}
