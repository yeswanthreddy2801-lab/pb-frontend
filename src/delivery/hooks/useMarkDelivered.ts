import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryApi } from '../api/delivery.api';
import { DeliveryStatus } from '../types/delivery.types';
import { toast } from 'sonner';

export const useMarkDelivered = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: DeliveryStatus; reason?: string }) =>
      deliveryApi.updateStatus(id, status, reason),
    onSuccess: (data, variables) => {
      // Invalidate both today and pending queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['deliveries', 'today'] });
      queryClient.invalidateQueries({ queryKey: ['deliveries', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['delivery', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['delivery', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update delivery status');
    }
  });
};
