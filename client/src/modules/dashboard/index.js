import { useContext } from "react";

//! User Imports

import { AppContext } from "AppContext";
import { ROLES } from "common/constants";
import CustomerDashboard from "./components/CustomerDashboard";
import RestaurantDashboard from "./components/RestaurantDashboard";

function Dashboard() {
  const {
    state: { role },
  } = useContext(AppContext);
  return role === ROLES.USER ? <CustomerDashboard /> : <RestaurantDashboard />;
}

export default Dashboard;
