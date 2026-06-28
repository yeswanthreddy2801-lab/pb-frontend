import type { FoodItem } from "@/types/food.types";

export const FOOD_ITEMS: FoodItem[] = [
  { id: '1', name: 'Whole Egg', category: 'egg', planType: 'nonveg', protein: 6, calories: 78, price: 8, emoji: '🥚', color: '#FEF9C3', description: 'Rich in complete protein' },
  { id: '2', name: 'Boiled Egg', category: 'egg', planType: 'nonveg', protein: 6.5, calories: 72, price: 8, emoji: '🍳', color: '#FEF9C3', description: 'Easy digestible protein' },
  { id: '3', name: 'Paneer 100g', category: 'dairy', planType: 'veg', protein: 18, calories: 265, price: 35, emoji: '🧀', color: '#FFF7ED', description: 'High protein cottage cheese' },
  { id: '4', name: 'Curd 150g', category: 'dairy', planType: 'veg', protein: 5, calories: 98, price: 15, emoji: '🥛', color: '#F0FDF4', description: 'Probiotic-rich protein' },
  { id: '5', name: 'Milk 250ml', category: 'dairy', planType: 'veg', protein: 8, calories: 150, price: 20, emoji: '🥛', color: '#F0F9FF', description: 'Classic protein source' },
  { id: '6', name: 'Oats 50g', category: 'grain', planType: 'veg', protein: 6.5, calories: 189, price: 12, emoji: '🌾', color: '#FFFBEB', description: 'Slow-release energy' },
  { id: '7', name: 'Besan Chilla', category: 'grain', planType: 'veg', protein: 9, calories: 180, price: 25, emoji: '🫓', color: '#FEF3C7', description: 'Protein-packed pancake' },
  { id: '8', name: 'Idli (2 pcs)', category: 'grain', planType: 'veg', protein: 4, calories: 130, price: 20, emoji: '🍚', color: '#F8FAFC', description: 'Light fermented rice cake' },
  { id: '9', name: 'Poha 100g', category: 'grain', planType: 'veg', protein: 3.5, calories: 180, price: 18, emoji: '🍽️', color: '#FFFBEB', description: 'Flattened rice delight' },
  { id: '10', name: 'Upma 100g', category: 'grain', planType: 'veg', protein: 4, calories: 170, price: 20, emoji: '🫕', color: '#FEF3C7', description: 'Semolina protein bowl' },
  { id: '11', name: 'Sprouts 100g', category: 'legume', planType: 'veg', protein: 8, calories: 62, price: 15, emoji: '🌱', color: '#F0FDF4', description: 'Live enzymes & protein' },
  { id: '12', name: 'Chana 100g', category: 'legume', planType: 'veg', protein: 19, calories: 364, price: 20, emoji: '🫘', color: '#FEF9C3', description: 'High protein chickpeas' },
  { id: '13', name: 'Rajma 100g', category: 'legume', planType: 'veg', protein: 24, calories: 337, price: 22, emoji: '🫘', color: '#FEE2E2', description: 'Kidney bean powerhouse' },
  { id: '14', name: 'Moong Dal 100g', category: 'legume', planType: 'veg', protein: 24, calories: 347, price: 18, emoji: '🫛', color: '#ECFDF5', description: 'Easily digestible lentil' },
  { id: '15', name: 'Soya Chunks 50g', category: 'legume', planType: 'veg', protein: 25, calories: 173, price: 18, emoji: '🫘', color: '#EDE9FE', description: 'Highest plant protein' },
  { id: '16', name: 'Banana', category: 'fruit', planType: 'veg', protein: 1.3, calories: 89, price: 10, emoji: '🍌', color: '#FEFCE8', description: 'Natural energy booster' },
  { id: '17', name: 'Apple', category: 'fruit', planType: 'veg', protein: 0.5, calories: 52, price: 20, emoji: '🍎', color: '#FEF2F2', description: 'Fiber-rich morning fruit' },
  { id: '18', name: 'Sweet Potato', category: 'vegetable', planType: 'veg', protein: 2, calories: 86, price: 15, emoji: '🍠', color: '#FFF7ED', description: 'Complex carbs + protein' },
  { id: '19', name: 'Peanuts 30g', category: 'nut', planType: 'veg', protein: 7.7, calories: 170, price: 12, emoji: '🥜', color: '#FEF3C7', description: 'Healthy fat & protein' },
  { id: '20', name: 'Protein Shake', category: 'supplement', planType: 'both', protein: 25, calories: 130, price: 60, emoji: '🥤', color: '#EDE9FE', description: 'Whey protein blend' },
  { id: '21', name: 'Chicken Breast 100g', category: 'meat', planType: 'nonveg', protein: 31, calories: 165, price: 60, emoji: '🍗', color: '#FEF9C3', description: 'Lean muscle builder' },
  { id: '22', name: 'Fish Steamed 100g', category: 'meat', planType: 'nonveg', protein: 22, calories: 128, price: 55, emoji: '🐟', color: '#EFF6FF', description: 'Omega-3 rich protein' },
  { id: '23', name: 'Tofu 100g', category: 'dairy', planType: 'veg', protein: 8, calories: 76, price: 30, emoji: '🍱', color: '#F0FDF4', description: 'Plant-based protein block' },
  { id: '24', name: 'Greek Yogurt 150g', category: 'dairy', planType: 'veg', protein: 15, calories: 130, price: 40, emoji: '🥣', color: '#F8FAFC', description: 'Thick protein-rich yogurt' },
  { id: '25', name: 'Quinoa 75g', category: 'grain', planType: 'veg', protein: 8, calories: 222, price: 45, emoji: '🌾', color: '#ECFDF5', description: 'Complete amino acid grain' },
];

export const PLANS = [
  { id: 'p1', name: 'Veg Protein Box', slug: 'veg' as const, description: 'Pure vegetarian protein sources', basePrice: 299, maxItems: 6, emoji: '🥗', color: '#16A34A' },
  { id: 'p2', name: 'Non-Veg Protein Box', slug: 'nonveg' as const, description: 'Egg & meat protein sources', basePrice: 399, maxItems: 6, emoji: '🍗', color: '#EA580C' },
  { id: 'p3', name: 'High Protein Fitness Box', slug: 'fitness' as const, description: 'Maximum protein for fitness', basePrice: 499, maxItems: 6, emoji: '💪', color: '#7C3AED' },
];