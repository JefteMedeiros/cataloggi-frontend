import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export function ItemPage() {
  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur-sm">
        <Link
          to="/category/placeholder"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Voltar para categoria"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </Link>
        <h1 className="truncate text-base font-semibold tracking-tight">
          Item
        </h1>
      </header>

      <article
        className={cn(
          'mx-auto max-w-2xl px-6 py-8',
          '[&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-foreground',
          '[&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground',
          '[&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground',
          '[&_p]:mb-4 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground',
          '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-sm [&_ul]:text-muted-foreground',
          '[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-sm [&_ol]:text-muted-foreground',
          '[&_li]:mb-1 [&_li]:leading-relaxed',
          '[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-foreground',
          '[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted [&_pre]:p-4',
          '[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-xs',
          '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground',
          '[&_strong]:font-semibold [&_strong]:text-foreground',
          '[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2',
        )}
      >
        <h1>Item</h1>
        <p>
          Conteúdo do item.
        </p>
        <h2>Seção</h2>
        <ul>
          <li>Informação</li>
          <li>Informação</li>
          <li>Informação</li>
        </ul>
      </article>
    </div>
  );
}
