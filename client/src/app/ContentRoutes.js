import { useContext } from "react";
import { Route, Switch } from "react-router-dom";

//! User Files

import { AppContext } from "AppContext";
import { routesList } from "common/routesList";

const ContentRoutes = () => {
  const {
    state: { role },
  } = useContext(AppContext);

  return (
    <Switch>
      {routesList.map((route) => {
        return (
          route.allowedRoles.includes(role) && (
            <Route
              exact
              path={route.link}
              render={() => <route.view />}
              key={route.link}
            />
          )
        );
      })}
    </Switch>
  );
};

export default ContentRoutes;
