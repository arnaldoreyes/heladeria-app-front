import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSalesAction,
  getSaleByIdAction,
  createSaleAction,
  voidSaleAction,
  getTodaySalesSummaryAction,
  type GetSalesFilters,
} from '../actions/sales.actions';
import { toast } from 'sonner';
import { useCartStore } from './useCartStore';
import type { CreateSaleFormData, VoidSaleFormData } from '../schemas/sales.schema';

// Query Keys Factory para mantener consistencia de caché
export const salesKeys = {
  all: ['sales'] as const,
  lists: () => [...salesKeys.all, 'list'] as const,
  list: (filters: GetSalesFilters) => [...salesKeys.lists(), filters] as const,
  details: () => [...salesKeys.all, 'detail'] as const,
  detail: (id: string) => [...salesKeys.details(), id] as const,
  summaryToday: () => [...salesKeys.all, 'summary', 'today'] as const,
};

/**
 * Hook para listar ventas paginadas y filtradas
 */
export const useSales = (filters: GetSalesFilters = {}) => {
  return useQuery({
    queryKey: salesKeys.list(filters),
    queryFn: () => getSalesAction(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos de datos frescos
  });
};

/**
 * Hook para consultar el detalle de un ticket/venta
 */
export const useSale = (id: string) => {
  return useQuery({
    queryKey: salesKeys.detail(id),
    queryFn: () => getSaleByIdAction(id),
    enabled: Boolean(id),
  });
};

/**
 * Hook para obtener el resumen de ventas del día actual
 */
export const useTodaySalesSummary = () => {
  return useQuery({
    queryKey: salesKeys.summaryToday(),
    queryFn: () => getTodaySalesSummaryAction(),
    refetchInterval: 1000 * 60 * 5, // Auto-refrescar cada 5 min
  });
};

/**
 * Hook (Mutation) para procesar una nueva venta
 */
export const useCreateSale = () => {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: (payload: CreateSaleFormData) => createSaleAction(payload),
    onSuccess: (newSale) => {
      toast.success(`Venta #${newSale.ticket_number} realizada con éxito`);

      // 1. Limpiar el carrito de Zustand
      clearCart();

      // 2. Invalidad consultas de ventas
      queryClient.invalidateQueries({ queryKey: salesKeys.all });

      // 3. Invalidad stock de productos en caché para actualizar la grid del POS
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al procesar la venta';
      toast.error(message);
    },
  });
};

/**
 * Hook (Mutation) para anular una venta
 */
export const useVoidSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: VoidSaleFormData }) =>
      voidSaleAction(id, payload),
    onSuccess: (voidedSale) => {
      toast.success(`Venta #${voidedSale.ticket_number} anulada correctamente`);

      // Invalidar caché de ventas y stock de productos restaurado
      queryClient.invalidateQueries({ queryKey: salesKeys.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'No se pudo anular la venta';
      toast.error(message);
    },
  });
};