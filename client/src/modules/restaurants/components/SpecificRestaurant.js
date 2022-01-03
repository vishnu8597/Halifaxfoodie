import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

//! User Files

import { AppContext } from "AppContext";
import api from "common/api";
import { toast } from "common/utils";
import Loading from "components/Loading";
import RestaurantDetail from "./RestaurantDetail";
import FoodItems from "modules/food_items";

function SpecificRestaurant() {
  const {
    state: { authToken },
  } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [restaurantDetail, setRestaurantDetail] = useState({});
  const [restaurantFoodItems, setRestaurantFoodItems] = useState([]);
  const [featuredFoodItems, setFeaturedFoodItems] = useState([]);

  const params = useParams();
  const restaurantId = params?.restaurantId;

  const fetchRestaurantDetails = async () => {
    setLoading(true);
    try {
      const restaurantData = await api.get(`/restaurants/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const { data: restaurantDetail } = restaurantData;
      const restaurantFoodData = await api.get(
        `/food-item/restaurant/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const { data: restaurantFoodDetail } = restaurantFoodData;

      const featuredFoodData = await api.get(
        `/food-item/featured/restaurant/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const { data: featuredFoodDetail } = featuredFoodData;
      setRestaurantDetail(restaurantDetail[0]);
      setRestaurantFoodItems(restaurantFoodDetail);
      setFeaturedFoodItems(featuredFoodDetail);
    } catch (error) {
      setError(true);
      toast({
        message: "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantDetails();
    // eslint-disable-next-line
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>Something went wrong</div>;
  return (
    <div>
      <RestaurantDetail
        restaurantDetail={restaurantDetail}
        dishesOffered={restaurantFoodItems.length}
      />
      {featuredFoodItems.length > 0 && (
        <>
          <div className="mb-1 sdp-text-strong heading">Featured Dishes</div>
          <FoodItems restaurantFoodItems={featuredFoodItems} />
        </>
      )}
      <div className="mx-1 sdp-text-strong heading">Dishes</div>
      <FoodItems restaurantFoodItems={restaurantFoodItems} />
    </div>
  );
}

export default SpecificRestaurant;
