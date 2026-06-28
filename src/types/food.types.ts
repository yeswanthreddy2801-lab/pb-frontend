export type FoodCategory = 'egg' | 'dairy' | 'grain' | 'legume' | 'fruit' | 'nut' | 'meat' | 'supplement' | 'vegetable';
export type PlanType = 'veg' | 'nonveg' | 'both';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  planType: PlanType;
  protein: number;
  calories: number;
  price: number;
  emoji: string;
  color: string;
  description: string;
  isActive?: boolean;
  isAvailable?: boolean;
}

export interface SelectedFoodItem extends FoodItem {
  quantity: number;
}

export interface FlyingItem {
  id: string;
  emoji: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: 'veg' | 'nonveg' | 'fitness';
  description: string;
  basePrice: number;
  maxItems: number;
  emoji: string;
  color: string;
}