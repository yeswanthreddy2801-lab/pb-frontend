import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { deliveryApi } from '../api/delivery.api';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { format } from 'date-fns';

export default function CompletedDeliveries() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: deliveries, isLoading } = useQuery({
    queryKey: ['deliveries', 'completed', date],
    queryFn: () => deliveryApi.getCompletedDeliveries(date),
  });

  const filteredDeliveries = (deliveries || []).filter((d: any) => 
    d.users.name.toLowerCase().includes(search.toLowerCase()) || 
    d.users.mobile.includes(search)
  );

  return (
    <div className="min-h-screen bg-surface p-4 pb-20">
      <div className="flex items-center gap-4 mb-6 sticky top-0 bg-surface z-10 py-2">
        <button onClick={() => navigate(-1)} className="text-gray-500 text-2xl font-bold">←</button>
        <h1 className="text-xl font-bold">Completed ✅ ({deliveries?.length || 0})</h1>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input 
            className="pl-10 h-12 rounded-xl bg-white" 
            placeholder="Search customer..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          className="w-40 h-12 rounded-xl bg-white"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-2xl w-full"></div>
          ))}
        </div>
      ) : filteredDeliveries.length > 0 ? (
        <div className="space-y-4">
          {filteredDeliveries.map((delivery: any) => (
            <div 
              key={delivery.id} 
              className="bg-white rounded-2xl shadow-sm border p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => navigate(`/delivery/details/${delivery.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{delivery.users.name}</h3>
                  <p className="text-sm text-gray-500">{delivery.users.mobile}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-md mb-1">
                    Delivered
                  </p>
                  <p className="text-xs text-gray-400">
                    {delivery.delivered_at ? format(new Date(delivery.delivered_at), 'hh:mm a') : ''}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                {delivery.addresses?.house_number 
                  ? `${delivery.addresses.house_number}, ${delivery.addresses.street}, ${delivery.addresses.area}`
                  : delivery.addresses?.address || 'Address not provided'}
              </p>
              <div className="flex flex-wrap gap-1">
                {delivery.subscriptions?.subscription_items?.map((item: any, idx: number) => (
                  <span key={idx} className="bg-gray-100 text-sm px-1.5 py-0.5 rounded" title={item.food_items.name}>
                    {item.food_items.emoji}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl text-center shadow-sm mt-8 border">
          <p className="text-gray-500 font-semibold">No deliveries completed on {date}</p>
        </div>
      )}
    </div>
  );
}
