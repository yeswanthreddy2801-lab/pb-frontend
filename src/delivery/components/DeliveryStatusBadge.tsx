import React from 'react';
import { DeliveryStatus } from '../types/delivery.types';
import { cn } from '@/lib/utils';

interface DeliveryStatusBadgeProps {
  status: DeliveryStatus;
  className?: string;
}

export function DeliveryStatusBadge({ status, className }: DeliveryStatusBadgeProps) {
  const statusConfig = {
    pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700' },
    out_for_delivery: { label: 'Out for Delivery', bg: 'bg-blue-100', text: 'text-blue-700' },
    delivered: { label: 'Delivered', bg: 'bg-green-100', text: 'text-green-700' },
    failed: { label: 'Failed', bg: 'bg-red-100', text: 'text-red-700' },
    cancelled: { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-700' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={cn('px-2.5 py-1 text-xs font-semibold rounded-full', config.bg, config.text, className)}>
      {config.label}
    </span>
  );
}
