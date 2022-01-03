import { useContext, useEffect, useState } from "react";

//! User Files

import api from "common/api";
import { toast } from "common/utils";
import { Card } from "antd";
import Loading from "components/Loading";
import { Link } from "react-router-dom";
import { AppContext } from "AppContext";

const { Meta } = Card;

function Restaurants() {
  const {
    state: { authToken },
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  const fetchAllRestaurants = async () => {
    try {
      setLoading(true);
      const response = await api.get("/restaurants", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const { data } = response;
      setRestaurants(data);
    } catch (error) {
      toast({
        message: "Something went wrong",
        type: "error",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAllRestaurants();
    // eslint-disable-next-line
  }, []);

  if (loading) return <Loading />;
  return (
    <div className="restaurant-wrapper">
      {restaurants.map((restaurant) => (
        <Link
          to={`/restaurant/${restaurant.restaurant_id}`}
          key={restaurant.restaurant_id}
        >
          <Card>
            <Meta
              title={restaurant.restaurant_name}
              description={restaurant.phone_number}
            />
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default Restaurants;
