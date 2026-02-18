import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type PromotionInput, type PromotionUpdateInput } from "@shared/routes";

export function usePromotions() {
  return useQuery({
    queryKey: [api.promotions.list.path],
    queryFn: async () => {
      const res = await fetch(api.promotions.list.path, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch promotions');
      return api.promotions.list.responses[200].parse(await res.json());
    },
  });
}

export function useActivePromotions() {
  return useQuery({
    queryKey: [api.promotions.active.path],
    queryFn: async () => {
      const res = await fetch(api.promotions.active.path, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch active promotions');
      return api.promotions.active.responses[200].parse(await res.json());
    },
  });
}

export function usePromotion(id: string) {
  return useQuery({
    queryKey: [api.promotions.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.promotions.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch promotion');
      return api.promotions.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: PromotionInput) => {
      const validated = api.promotions.create.input.parse(data);
      const res = await fetch(api.promotions.create.path, {
        method: api.promotions.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.promotions.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create promotion');
      }
      return api.promotions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.promotions.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.promotions.active.path] });
    },
  });
}

export function useUpdatePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & PromotionUpdateInput) => {
      const validated = api.promotions.update.input.parse(updates);
      const url = buildUrl(api.promotions.update.path, { id });
      const res = await fetch(url, {
        method: api.promotions.update.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.promotions.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 404) throw new Error('Promotion not found');
        throw new Error('Failed to update promotion');
      }
      return api.promotions.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.promotions.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.promotions.active.path] });
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const url = buildUrl(api.promotions.delete.path, { id });
      const res = await fetch(url, { method: api.promotions.delete.method, credentials: "include" });
      if (res.status === 404) throw new Error('Promotion not found');
      if (!res.ok) throw new Error('Failed to delete promotion');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.promotions.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.promotions.active.path] });
    },
  });
}
