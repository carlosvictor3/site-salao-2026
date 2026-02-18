import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type OrderInput, type OrderStatusUpdateInput } from "@shared/routes";

export function useOrders(params?: { status?: string }) {
  return useQuery({
    queryKey: [api.orders.list.path, params],
    queryFn: async () => {
      let url = api.orders.list.path;
      if (params?.status) {
        url += `?status=${params.status}`;
      }
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch orders');
      return api.orders.list.responses[200].parse(await res.json());
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: [api.orders.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.orders.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch order');
      return api.orders.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: OrderInput) => {
      const validated = api.orders.create.input.parse(data);
      const res = await fetch(api.orders.create.path, {
        method: api.orders.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.orders.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to create order');
      }
      return api.orders.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.orders.list.path] }),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const validated = api.orders.updateStatus.input.parse({ status });
      const url = buildUrl(api.orders.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.orders.updateStatus.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.orders.updateStatus.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 404) throw new Error('Order not found');
        throw new Error('Failed to update order status');
      }
      return api.orders.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.orders.list.path] }),
  });
}
