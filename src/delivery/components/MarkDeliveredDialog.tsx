import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMarkDelivered } from '../hooks/useMarkDelivered';
import { toast } from 'sonner';

interface MarkDeliveredDialogProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: any;
  onSuccess?: () => void;
}

export function MarkDeliveredDialog({ isOpen, onClose, delivery, onSuccess }: MarkDeliveredDialogProps) {
  const { mutateAsync: markDelivered } = useMarkDelivered();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await markDelivered({ id: delivery.id, status: 'delivered' });
      toast.success('Delivery confirmed! 🎉');
      onClose();
      if (onSuccess) onSuccess();
    } catch (e) {
      // Error toast is handled in the hook
    } finally {
      setIsLoading(false);
    }
  };

  if (!delivery) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-2xl max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Confirm Delivery ✅</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600">
            Are you sure the breakfast box has been delivered to:
            <br />
            <strong className="text-gray-900 mt-2 block">{delivery.users?.name}</strong>
            <span className="text-sm mt-1 block">
              {delivery.addresses?.house_number} {delivery.addresses?.street}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 sm:flex-col gap-2">
          <Button 
            className="w-full bg-brand-green hover:bg-brand-green/90 text-white h-12 text-lg" 
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Confirming...' : 'Confirm Delivery'}
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-12 text-lg mt-0 sm:mt-0" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Need to import Button here because AlertDialogAction doesn't support our custom loading state as easily
import { Button } from '@/components/ui/button';
