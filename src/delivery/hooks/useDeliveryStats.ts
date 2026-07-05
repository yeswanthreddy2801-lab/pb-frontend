import { useQuery } from '@tanstack/react-query';
import { deliveryApi } from '../api/delivery.api';

export const useDeliveryStats = () => {
  return useQuery({
    queryKey: ['delivery', 'stats'],
    queryFn: deliveryApi.getStats,
    refetchInterval: 30000, // 30 seconds
  });
};
