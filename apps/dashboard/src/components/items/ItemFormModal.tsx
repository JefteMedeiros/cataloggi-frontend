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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@workspace/ui/components/select";
import { useEffect, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { cn } from "@workspace/ui/lib/utils";
import {
  useCreateItemMutation,
  useItemQuery,
  useUpdateItemMutation,
} from "../../hooks/use-items";
import type {
  CategoryDto,
  CreateItemDto,
  ItemSummary,
  UpdateItemDto,
} from "../../lib/types";

const itemSchema = z.object({
  name: z.string().trim().min(1, "O nome é obrigatório"),
  categoryId: z.string().min(1, "A categoria é obrigatória"),
  content: z.string().min(1, "O conteúdo é obrigatório"),
  fileName: z.string().optional(),
});

type ItemValues = z.infer<typeof itemSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: ItemSummary | null;
  categories: CategoryDto[];
}

export default function ItemFormModal({
  open,
  onOpenChange,
  item,
  categories,
}: Props) {
  const createItem = useCreateItemMutation();
  const updateItem = useUpdateItemMutation();

  const form = useForm<ItemValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { name: "", categoryId: "", content: "", fileName: "" },
  });
  const selectedFileName = useWatch({
    control: form.control,
    name: "fileName",
  });

  const { data: itemDetail } = useItemQuery(item?.id, open && Boolean(item));

  useEffect(() => {
    if (!open) {
      return;
    }

    if (item && itemDetail) {
      form.reset({
        name: itemDetail.name ?? "",
        categoryId: itemDetail.categoryId,
        content: itemDetail.content ?? "",
        fileName: "",
      });
      return;
    }

    if (!item) {
      form.reset({ name: "", categoryId: "", content: "", fileName: "" });
    }
  }, [form, item, itemDetail, open]);

  function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      form.setValue("content", (loadEvent.target?.result as string) ?? "", {
        shouldValidate: true,
      });
      form.setValue("fileName", file.name);
    };

    reader.readAsText(file);
  }

  async function onSubmit(values: ItemValues) {
    try {
      if (item) {
        const body: UpdateItemDto = {
          name: values.name.trim(),
          categoryId: values.categoryId,
          content: values.content,
        };

        await updateItem.mutateAsync({ id: item.id, body });
        toast.success("Item atualizado");
      } else {
        const body: CreateItemDto = {
          name: values.name.trim(),
          categoryId: values.categoryId,
          content: values.content,
        };

        await createItem.mutateAsync(body);
        toast.success("Item criado");
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
          <DialogTitle>{item ? "Editar item" : "Novo item"}</DialogTitle>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value ?? "")}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <span
                          className={cn(
                            field.value ? "" : "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? categories.find((category) => category.id === field.value)?.name ??
                              String(field.value)
                            : "Selecione uma categoria"}
                        </span>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={() => (
                <FormItem>
                  <FormLabel>Conteúdo Markdown (.md)</FormLabel>
                  <FormControl>
                    <Input type="file" accept=".md,text/markdown" onChange={handleFileUpload} />
                  </FormControl>
                  {selectedFileName ? (
                    <p className="text-xs text-muted-foreground">Arquivo selecionado: {selectedFileName}</p>
                  ) : item ? (
                    <p className="text-xs text-muted-foreground">
                      Nenhum novo arquivo selecionado.
                    </p>
                  ) : null}
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
