import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type ServiceInput, type ServiceUpdateInput } from "@shared/routes";

export function useServices() {
  return useQuery({
    queryKey: [api.services.list.path],
    queryFn: async () => {
      const res = await fetch(api.services.list.path, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch services');
      return api.services.list.responses[200].parse(await res.json());
    },
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: [api.services.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.services.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch service');
      return api.services.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ServiceInput) => {
      const validated = api.services.create.input.parse(data);
      const res = await fetch(api.services.create.path, {
        method: api.services.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.services.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create service');
      }
      return api.services.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.services.list.path] }),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & ServiceUpdateInput) => {
      const validated = api.services.update.input.parse(updates);
      const url = buildUrl(api.services.update.path, { id });
      const res = await fetch(url, {
        method: api.services.update.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.services.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 404) throw new Error('Service not found');
        throw new Error('Failed to update service');
      }
      return api.services.update.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.services.list.path] }),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const url = buildUrl(api.services.delete.path, { id });
      const res = await fetch(url, { method: api.services.delete.method, credentials: "include" });
      if (res.status === 404) throw new Error('Service not found');
      if (!res.ok) throw new Error('Failed to delete service');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.services.list.path] }),
  });
}
