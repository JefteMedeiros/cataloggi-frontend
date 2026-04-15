import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { apiFetch } from "../../lib/api";
import { getAutoCategoryFields } from "../../lib/category-fields";
import type { CategoryDto, CreateCategoryDto } from "../../lib/types";

const categorySchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório"),
});

type CategoryValues = z.infer<typeof categorySchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CategoryDto | null;
}

export default function CategoryFormModal({
  open,
  onOpenChange,
  category,
}: Props) {
  const queryClient = useQueryClient();

  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(category ? { name: category.name } : { name: "" });
  }, [category, form, open]);

  async function onSubmit(values: CategoryValues) {
    const name = values.name.trim();
    const body: CreateCategoryDto = {
      name,
      ...getAutoCategoryFields(name),
    };

    try {
      if (category) {
        await apiFetch(`/api/admin/categories/${category.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        toast.success("Categoria atualizada");
      } else {
        await apiFetch("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(body),
        });
        toast.success("Categoria criada");
      }

      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      onOpenChange(false);
    } catch {
      toast.error("Algo deu errado. Tente novamente.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Editar categoria" : "Nova categoria"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Fiação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
