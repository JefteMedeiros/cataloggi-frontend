import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../../hooks/use-categories";
import type { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from "../../lib/types";

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
  const createCategory = useCreateCategoryMutation();
  const updateCategory = useUpdateCategoryMutation();

  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(category ? { name: category.name ?? "" } : { name: "" });
  }, [category, form, open]);

  async function onSubmit(values: CategoryValues) {
    const name = values.name.trim();

    try {
      if (category) {
        const body: UpdateCategoryDto = { name };

        await updateCategory.mutateAsync({ id: category.id, body });
        toast.success("Categoria atualizada");
      } else {
        const body: CreateCategoryDto = { name };

        await createCategory.mutateAsync(body);
        toast.success("Categoria criada");
      }

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
