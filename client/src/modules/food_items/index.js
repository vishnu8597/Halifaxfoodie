import { useContext, useState } from "react";

//! Ant Imports

import { List, Card } from "antd";

//! User Files

import { AppContext } from "AppContext";
import Featured from "./components/Featured";
import DeleteItem from "./components/DeleteItem";
import { ROLES } from "common/constants";
import api from "common/api";
import { toast } from "common/utils";
import logo from "../../assets/images/placeholder.jpg";
import AddToCart from "./components/AddToCart";
import SimilarItem from "./components/SimilarItem";

function FoodItems({ restaurantFoodItems, isUser, isOrderPage }) {
  const [foodItems, setFoodItems] = useState(restaurantFoodItems || []);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const {
    state: { role, userId },
  } = useContext(AppContext);

  const handleFeaturedClick = async (itemData) => {
    setUpdateLoading(true);
    const updatedItem = {
      itemName: itemData.item_name,
      price: itemData.price,
      recipe: itemData.recipe,
      featured: !itemData.featured,
      ingredients: itemData.ingredients,
      preparationTime: itemData.preparation_time,
    };
    try {
      const response = await api.patch(
        `/food-item/${itemData.item_id}/restaurant/${userId}`,
        updatedItem
      );
      const { data } = response;
      toast({
        message: data.message,
        type: "success",
      });

      const duplicateFoodItemArray = [...foodItems];

      const foodIndex = duplicateFoodItemArray.findIndex(
        (foodItem) => foodItem.item_id === itemData.item_id
      );
      duplicateFoodItemArray[foodIndex] = {
        ...itemData,
        featured: !itemData.featured,
      };
      setFoodItems(duplicateFoodItemArray);
    } catch (error) {
      toast({
        message: "Something went wrong",
        type: "error",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteItem = async (itemData) => {
    setDeleteLoading(true);
    try {
      const response = await api.delete(
        `/food-item/${itemData.item_id}/restaurant/${userId}`
      );
      const { data } = response;
      toast({
        message: data.message,
        type: "success",
      });
      setFoodItems(
        foodItems.filter((foodItem) => foodItem.item_id !== itemData.item_id)
      );
    } catch (error) {
      toast({
        message: "Something went wrong",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Card>
      <List
        className="mx-1"
        itemLayout="vertical"
        size="large"
        dataSource={foodItems}
        locale={{ emptyText: "This restaurant is not serving at the moment" }}
        renderItem={(item) => (
          <List.Item
            key={item.item_id}
            actions={
              role === ROLES.ADMIN && !isOrderPage
                ? [
                    <Featured
                      itemData={item}
                      handleFeaturedClick={handleFeaturedClick}
                      updateLoading={updateLoading}
                    />,
                    <DeleteItem
                      itemData={item}
                      handleDeleteItem={handleDeleteItem}
                      deleteLoading={deleteLoading}
                    />,
                  ]
                : [
                    !isOrderPage && <AddToCart itemData={item} />,
                    !isOrderPage && <SimilarItem itemData={item} />,
                  ]
            }
            extra={
              <img
                className="food-photos"
                alt="logo"
                src={item.food_photo_url ? item.food_photo_url : logo}
              />
            }
          >
            <List.Item.Meta
              title={
                <span className="sdp-text-strong">
                  {item.item_name} {isUser && `| ${item.restaurant_name}`}{" "}
                  {isOrderPage && `x ${item.quantity}`}
                </span>
              }
              description={item.recipe}
            />
            <div className="px">{item.ingredients}</div>
            <div className="px">Preparation Time: {item.preparation_time}</div>
            <div className="px">Price: ${item.price}</div>
            {isOrderPage && (
              <div className="px">Item Total: ${item.total_price}</div>
            )}
          </List.Item>
        )}
      />
    </Card>
  );
}

export default FoodItems;
