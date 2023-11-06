import React, { useState, useEffect } from "react";
import { Modal, Button, Box, Rating } from "@mui/material";
import { toast } from "react-toastify";
import DynamicForm from "../../components/DynamicForm";
import useFetcher from "../../customHooks/useFetcher";
import { List } from "../../components/List";
import { Meal } from "../types/meals";

const MenuPage: React.FC = () => {
  const [mealsData, setMealsData] = useState<Meal[]>([]);
  const [open, setOpen] = useState(false);
  const fetch = useFetcher();

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("/intern/menu");
      setMealsData(result.data.meals);
    };
    fetchData();
  }, []);

  const handleAddMenuItem = async (newMeal: Meal) => {
    try {
      await fetch("/intern/menu", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(newMeal),
      });
      setMealsData([...mealsData, newMeal]); // You may need to adjust this line based on the actual response format
      toast.success("Menu item added successfully!");
    } catch (error) {
      console.error("error:", error);
      toast.error("Failed to add menu item.");
    }
  };

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Add Menu Item</Button>
      <List
        items={mealsData}
        renderItem={(meal: Meal) => {
          return (
            <div>
              <h3>{meal.name}</h3>
              <p>{meal.description}</p>
              <Rating name={`rating-${meal.id}`} value={meal.rating} readOnly />
            </div>
          );
        }}
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <DynamicForm
            title="Add Menu Item"
            fields={[
              { label: "Name", key: "name", required: true },
              { label: "Description", key: "description", required: true },
            ]}
            onSubmit={handleAddMenuItem}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default MenuPage;
