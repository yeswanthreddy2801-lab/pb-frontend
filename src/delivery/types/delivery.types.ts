export interface DeliveryStaff {
  id: string;
  name: string;
  mobile: string;
  password_hash: string;
  email?: string;
  vehicle_number?: string;
  is_active: boolean;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export type DeliveryStatus = 'pending' | 'out_for_delivery' | 'delivered' | 'failed' | 'cancelled';
export type TimeSlot = 'morning_6_8' | 'morning_8_10';

export interface DailyDelivery {
  id: string;
  delivery_boy_id: string;
  subscription_id: string;
  customer_id: string;
  address_id: string;
  delivery_date: string;
  delivery_status: DeliveryStatus;
  time_slot: TimeSlot;
  assigned_at: Date;
  delivered_at?: Date;
  failed_reason?: string;
  delivery_notes?: string;
  delivered_by?: string;
  delivery_lat?: number;
  delivery_lng?: number;
  created_at: Date;
  updated_at: Date;
}

export interface DeliveryHistory {
  id: string;
  daily_delivery_id: string;
  delivery_boy_id: string;
  customer_id: string;
  subscription_id: string;
  delivery_date: string;
  delivered_at?: Date;
  status: DeliveryStatus;
  items_delivered?: any;
  address_snapshot?: any;
  notes?: string;
  created_at: Date;
}

export interface AuthDeliveryBoy {
  deliveryBoyId: string;
  name: string;
  mobile: string;
  role: 'delivery_boy';
}

export interface AssignDeliveryRequest {
  subscriptionId: string;
  deliveryBoyId: string;
  deliveryDate?: string;
  timeSlot?: TimeSlot;
}

export interface BulkAssignRequest {
  deliveryBoyId: string;
  subscriptionIds: string[];
  deliveryDate?: string;
  timeSlot?: TimeSlot;
}
