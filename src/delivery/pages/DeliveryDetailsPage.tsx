import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { deliveryApi } from '../api/delivery.api';
import { DeliveryStatusBadge } from '../components/DeliveryStatusBadge';
import { MarkDeliveredDialog } from '../components/MarkDeliveredDialog';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useMarkDelivered } from '../hooks/useMarkDelivered';

export default function DeliveryDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutateAsync: markOutForDelivery, isPending: isMarkingOut } = useMarkDelivered();

  const { data: delivery, isLoading } = useQuery({
    queryKey: ['delivery', id],
    queryFn: () => deliveryApi.getDeliveryDetails(id!),
    enabled: !!id
  });

  const handleCopyAddress = () => {
    if (!delivery) return;
    const addr = delivery.addresses;
    const addressString = addr.house_number 
      ? `${addr.house_number}, ${addr.street}, ${addr.area}, ${addr.city} - ${addr.pincode}`
      : addr.address;
    navigator.clipboard.writeText(addressString);
    toast.success('Address copied!');
  };

  const handleMarkOutForDelivery = async () => {
    if (!delivery) return;
    try {
      await markOutForDelivery({ id: delivery.id, status: 'out_for_delivery' });
      toast.success('Status updated to Out for Delivery! 🚚');
    } catch (e) {
      // Error handled in hook
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface p-4 pb-20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-40 bg-gray-200 rounded-2xl w-full"></div>
          <div className="h-40 bg-gray-200 rounded-2xl w-full"></div>
        </div>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="min-h-screen bg-surface p-4">
        <p className="text-center text-gray-500 mt-20">Delivery not found</p>
      </div>
    );
  }

  const addr = delivery.addresses;
  const fullAddressStr = addr.house_number 
    ? `${addr.house_number} ${addr.street}, ${addr.area}, ${addr.city}`
    : addr.address;
  const encodedAddress = encodeURIComponent(fullAddressStr);

  const hasCoords = addr.latitude && addr.longitude;
  const mapSrc = hasCoords 
    ? `https://www.google.com/maps?q=${addr.latitude},${addr.longitude}&z=16&output=embed`
    : `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
  
  const navLink = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${addr.latitude},${addr.longitude}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  
  const openLink = hasCoords
    ? `https://www.google.com/maps?q=${addr.latitude},${addr.longitude}`
    : `https://www.google.com/maps?q=${encodedAddress}`;

  return (
    <div className="min-h-screen bg-surface pb-32">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-500 text-2xl font-bold">←</button>
        <h1 className="text-xl font-bold">Delivery Details</h1>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* Customer Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-3">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">{delivery.users.name}</h2>
            <DeliveryStatusBadge status={delivery.delivery_status} className="text-sm px-3 py-1.5" />
          </div>
          <a href={`tel:${delivery.users.mobile}`} className="flex items-center text-brand-green font-semibold text-lg">
            <Phone className="h-5 w-5 mr-2" />
            {delivery.users.mobile}
          </a>
          <div className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mt-2">
            Expected: {delivery.time_slot === 'morning_6_8' ? '6 AM - 8 AM' : '8 AM - 10 AM'}
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-brand-green" />
              Delivery Address
            </h3>
            <button onClick={handleCopyAddress} className="text-gray-400 hover:text-brand-green">
              <Copy className="h-5 w-5" />
            </button>
          </div>
          <div className="text-gray-700 space-y-1 text-base">
            {addr.house_number ? (
              <>
                <p><span className="font-medium text-gray-900">House/Flat:</span> {addr.house_number}</p>
                <p><span className="font-medium text-gray-900">Street:</span> {addr.street}</p>
                <p><span className="font-medium text-gray-900">Area:</span> {addr.area}</p>
                {addr.landmark && <p><span className="font-medium text-gray-900">Landmark:</span> {addr.landmark}</p>}
                <p><span className="font-medium text-gray-900">Location:</span> {addr.city}, {addr.state} - {addr.pincode}</p>
              </>
            ) : (
              <p><span className="font-medium text-gray-900">Address:</span> {addr.address}</p>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border">
          <h3 className="font-bold text-gray-900 p-4 pb-2">Location Map 📍</h3>
          <div className="rounded-xl overflow-hidden mb-2">
            <iframe 
              src={mapSrc}
              width="100%" 
              height="250" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="flex gap-2 p-2">
            <Button variant="outline" className="flex-1" onClick={() => window.open(openLink)}>
              Open Map
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.open(navLink)}>
              Navigate
            </Button>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold text-gray-900 mb-4">Subscription Details</h3>
          <p className="font-semibold text-brand-green mb-3">{delivery.subscriptions.subscription_plans.name}</p>
          
          <div className="space-y-3">
            {delivery.subscriptions.subscription_items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.food_items.emoji}</span>
                  <div>
                    <p className="font-medium">{item.food_items.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand-green">{item.food_items.protein_g}g Pro</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto">
          {delivery.delivery_status === 'pending' && (
            <Button 
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
              onClick={handleMarkOutForDelivery}
              disabled={isMarkingOut}
            >
              {isMarkingOut ? 'Updating...' : 'Mark Out for Delivery 🚚'}
            </Button>
          )}

          {delivery.delivery_status === 'out_for_delivery' && (
            <Button 
              className="w-full h-14 text-lg bg-brand-green hover:bg-brand-green/90 text-white rounded-xl shadow-md"
              onClick={() => setIsDialogOpen(true)}
            >
              Mark as Delivered ✅
            </Button>
          )}

          {delivery.delivery_status === 'delivered' && (
            <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-bold text-lg border border-green-200">
              ✅ Delivered at {delivery.delivered_at ? new Date(delivery.delivered_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
            </div>
          )}

          {delivery.delivery_status === 'failed' && (
            <div className="bg-red-100 text-red-800 p-4 rounded-xl text-center font-bold text-lg border border-red-200">
              ❌ Delivery Failed
            </div>
          )}
        </div>
      </div>

      <MarkDeliveredDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        delivery={delivery}
        onSuccess={() => navigate(-1)}
      />
    </div>
  );
}
