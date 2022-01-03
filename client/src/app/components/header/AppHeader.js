import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

//! Ant Imports

import { Button, Typography, Layout } from "antd";

//! Ant Icons

import { ShoppingCartOutlined } from "@ant-design/icons";

//! User Files

import { ROLES, ROUTES } from "common/constants";
import MyCartDrawer from "modules/food_items/components/MyCartDrawer";
import { AppContext } from "AppContext";

const { Header } = Layout;
const { Title } = Typography;

const AppHeader = () => {
  const {
    state: { role },
  } = useContext(AppContext);
  const { push } = useHistory();
  const [visible, setVisible] = useState(false);

  const handleLogout = () => {
    push(ROUTES.LOGOUT);
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Header>
        <Title level={4}>HalifaxFoodie</Title>
        <div>
          {role !== ROLES.ADMIN && (
            <Button
              className="mx-8"
              icon={<ShoppingCartOutlined />}
              type="ghost"
              onClick={showDrawer}
            />
          )}
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </Header>

      <MyCartDrawer onClose={onClose} visible={visible} />
    </>
  );
};

export default AppHeader;
