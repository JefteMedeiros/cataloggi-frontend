import { Delete02Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import type { CategoryDto, ItemSummary } from "../../lib/types";

interface Props {
  items: ItemSummary[];
  categories: CategoryDto[];
  isLoading: boolean;
  onEdit: (item: ItemSummary) => void;
  onDelete: (item: ItemSummary) => void;
}

export default function ItemsTable({
  items,
  categories,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const categoryMap = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-background/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Última Atualização</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background/40 py-16 text-muted-foreground">
        <p className="text-sm">Nenhum item ainda. Crie um para começar.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background/40">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Última Atualização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{categoryMap.get(item.categoryId) ?? "-"}</TableCell>
              <TableCell>
                {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>
                <div className="flex w-full justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(item)}
                  >
                    <HugeiconsIcon
                      icon={Edit02Icon}
                      size={16}
                      strokeWidth={1.8}
                    />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item)}
                  >
                    <HugeiconsIcon
                      icon={Delete02Icon}
                      size={16}
                      strokeWidth={1.8}
                    />
                    Excluir
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
