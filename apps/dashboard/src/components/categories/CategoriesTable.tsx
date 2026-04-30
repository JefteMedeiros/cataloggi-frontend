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
import type { CategoryDto } from "../../lib/types";

interface Props {
  categories: CategoryDto[];
  isLoading: boolean;
  onEdit: (category: CategoryDto) => void;
  onDelete: (category: CategoryDto) => void;
}

export default function CategoriesTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-background/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background/40 py-16 text-muted-foreground">
        <p className="text-sm">
          Nenhuma categoria ainda. Crie uma para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background/40">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5">Nome</TableHead>
            <TableHead className="w-1/5">Slug</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name ?? "-"}</TableCell>
              <TableCell>{category.slug ?? "-"}</TableCell>
              <TableCell>
                <div className="flex w-full justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
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
                    onClick={() => onDelete(category)}
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
