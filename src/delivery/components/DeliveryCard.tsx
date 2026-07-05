import React from 'react';
import { DailyDelivery } from '../types/delivery.types';
import { DeliveryStatusBadge } from './DeliveryStatusBadge';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useMarkDelivered } from '../hooks/useMarkDelivered';

interface DeliveryCardProps {
  delivery: any;
}

export function DeliveryCard({ delivery }: DeliveryCardProps) {
  const navigate = useNavigate();
  const { mutate: markDelivered } = useMarkDelivered();

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const address = delivery.addresses;
    if (address.latitude && address.longitude) {
      window.open(`https://www.google.com/maps?q=${address.latitude},${address.longitude}`);
    } else {
      const fullAddress = address.house_number 
        ? `${address.house_number} ${address.street}, ${address.area}, ${address.city}`
        : address.address;
      window.open(`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`);
    }
  };

  const address = delivery.addresses;
  const addressLine = address.house_number 
    ? `${address.house_number}, ${address.street}, ${address.area}`
    : address.address;
  
  const timeSlotLabel = delivery.time_slot === 'morning_6_8' ? '6 AM - 8 AM' : '8 AM - 10 AM';

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/delivery/details/${delivery.id}`)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{delivery.users.name}</h3>
          <p className="text-sm text-gray-500">{delivery.users.mobile}</p>
        </div>
        <DeliveryStatusBadge status={delivery.delivery_status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-brand-green flex-shrink-0" />
          <span className="line-clamp-1">{addressLine} - {address.pincode}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-brand-green" />
          <span>{timeSlotLabel}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {delivery.subscriptions?.subscription_items?.slice(0, 4).map((item: any, idx: number) => (
          <span key={idx} className="bg-gray-100 text-lg px-2 py-1 rounded-lg" title={item.food_items.name}>
            {item.food_items.emoji}
          </span>
        ))}
        {delivery.subscriptions?.subscription_items?.length > 4 && (
          <span className="bg-gray-100 text-xs px-2 py-1 rounded-lg flex items-center font-medium text-gray-600">
            +{delivery.subscriptions.subscription_items.length - 4}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Button 
          variant="outline" 
          className="flex-1 text-brand-green border-brand-green hover:bg-brand-green/10"
          onClick={handleNavigate}
        >
          Navigate
        </Button>
        <Button 
          className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/delivery/details/${delivery.id}`);
          }}
        >
          Details
        </Button>
      </div>
    </div>
  );
}
