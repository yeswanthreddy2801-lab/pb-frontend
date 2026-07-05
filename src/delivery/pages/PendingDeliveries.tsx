import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { deliveryApi } from '../api/delivery.api';
import { DeliveryCard } from '../components/DeliveryCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function PendingDeliveries() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, morning_6_8, morning_8_10, out_for_delivery

  const { data: deliveries, isLoading } = useQuery({
    queryKey: ['deliveries', 'pending'],
    queryFn: deliveryApi.getPendingDeliveries,
    refetchInterval: 30000
  });

  const filteredDeliveries = (deliveries || []).filter((d: any) => {
    // text search
    const text = search.toLowerCase();
    const matchSearch = 
      d.users.name.toLowerCase().includes(text) || 
      d.users.mobile.includes(text) ||
      d.addresses.area.toLowerCase().includes(text) ||
      d.addresses.pincode.includes(text);
    
    // tab filter
    let matchFilter = true;
    if (filter === 'morning_6_8') matchFilter = d.time_slot === 'morning_6_8';
    if (filter === 'morning_8_10') matchFilter = d.time_slot === 'morning_8_10';
    if (filter === 'out_for_delivery') matchFilter = d.delivery_status === 'out_for_delivery';

    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-surface p-4 pb-20">
      <div className="flex items-center gap-4 mb-6 sticky top-0 bg-surface z-10 py-2">
        <button onClick={() => navigate(-1)} className="text-gray-500 text-2xl font-bold">←</button>
        <h1 className="text-xl font-bold">Pending Deliveries ({deliveries?.length || 0})</h1>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input 
          className="pl-10 h-12 rounded-xl bg-white" 
          placeholder="Search by name, mobile, area, pincode..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {['all', 'morning_6_8', 'morning_8_10', 'out_for_delivery'].map(tab => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors
              ${filter === tab ? 'bg-brand-green text-white' : 'bg-white text-gray-600 border'}`}
          >
            {tab === 'all' ? 'All' : 
             tab === 'morning_6_8' ? 'Morning 6-8' : 
             tab === 'morning_8_10' ? 'Morning 8-10' : 'Out for Delivery'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-2xl w-full"></div>
          ))}
        </div>
      ) : filteredDeliveries.length > 0 ? (
        <div className="space-y-4">
          {filteredDeliveries.map((delivery: any) => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl text-center shadow-sm mt-8 border">
          <div className="animate-bounce mb-4 text-4xl">🎉</div>
          <p className="text-gray-500 font-semibold text-lg">All delivered!</p>
          <p className="text-sm text-gray-400 mt-2">No pending deliveries found.</p>
        </div>
      )}
    </div>
  );
}
