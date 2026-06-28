export const formatINR = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
export const formatProtein = (n: number) => `${n.toFixed(1)}g`;
export const formatCalories = (n: number) => `${Math.round(n)} kcal`;