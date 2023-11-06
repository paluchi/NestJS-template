
export interface Meal {
    id: number;
    name: string;
    description: string;
    created_at: string; // Consider using Date type if date manipulation is needed
    rating: number;
  }
  
  export interface ChefMeals {
    chef: string;
    meals: Meal[];
  }