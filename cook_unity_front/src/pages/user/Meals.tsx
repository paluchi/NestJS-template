import React, { useEffect, useState } from "react";
import { Rating } from "@mui/material";
import useFetcher from "../../customHooks/useFetcher";
import { List } from "../../components/List";
import { toast } from "react-toastify"; // Assuming toast is from 'react-toastify'
import { ChefMeals, Meal } from "../types/meals";

const MealsPage: React.FC = () => {
  const [mealsData, setMealsData] = useState<ChefMeals[]>([]);
  const [filteredChef, setFilteredChef] = useState<string>("");
  const fetch = useFetcher();

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("/user/subscriptions/meals");
      setMealsData(result.data);
    };
    fetchData();
  }, []);

  const handleRating = (mealId: number, rating: number) => {
    fetch("/user/subscriptions/rate_meal", {
      method: "PUT",
      data: {
        mealId: mealId,
        rating: rating,
      },
    })
      .then(() => {
        // Assuming the response includes the updated meal with the new rating
        // Update the meal rating in the local state to reflect the change
        setMealsData((currentMealsData) =>
          currentMealsData.map((mealGroup) => ({
            ...mealGroup,
            meals: mealGroup.meals.map((meal) =>
              meal.id === mealId ? { ...meal, rating: rating } : meal
            ),
          }))
        );
        // Show success message
        toast.success("Meal rated successfully!");
      })
      .catch(() => {
        // Show error message
        toast.error("An error occurred while rating the meal.");
      });
  };

  const handleFilterChange = (chefName: string) => {
    setFilteredChef(chefName);
  };

  const displayedMeals = filteredChef
    ? mealsData.filter((meal) => meal.chef === filteredChef)
    : mealsData;

  const chefs = Array.from(new Set(mealsData.map((meal) => meal.chef))); // Use Set to remove duplicates

  return (
    <div>
      <List
        items={displayedMeals.flatMap((meal) => meal.meals)}
        renderItem={(meal: Meal) => (
          <div>
            <h3>{meal.name}</h3>
            <p>{meal.description}</p>
            <Rating
              name={`rating-${meal.id}`}
              value={meal.rating}
              onChange={(event, newValue) => {
                if (newValue !== null) {
                  handleRating(meal.id, newValue);
                }
              }}
            />
          </div>
        )}
        filterValues={chefs}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default MealsPage;
