import { useQuery } from '@tanstack/react-query';
import { deliveryApi } from '../api/delivery.api';
import { DailyDelivery } from '../types/delivery.types';

export const useTodayDeliveries = () => {
  return useQuery<DailyDelivery[], Error>({
    queryKey: ['deliveries', 'today'],
    queryFn: deliveryApi.getTodayDeliveries,
    refetchInterval: 30000, // 30 seconds
  });
};
