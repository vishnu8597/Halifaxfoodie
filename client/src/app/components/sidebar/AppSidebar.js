import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

//! Ant Imports

import Menu from "antd/lib/menu";
import Sider from "antd/lib/layout/Sider";

//! User Files

import logo from "../../../assets/images/dalhousie.jpg";
import { ROUTES } from "common/constants";
import { rootSubMenuKeys, siderMenu } from "common/siderRoutes";
import { AppContext } from "AppContext";

function AppSidebar() {
  const {
    state: { role },
  } = useContext(AppContext);
  const {
    push,
    location: { pathname },
  } = useHistory();

  const [openKeys, setOpenKeys] = useState([]);

  const onMenuSelect = (e) => {
    push(e.key);
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubMenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const renderSider = Object.keys(siderMenu).map((item) => {
    return (
      siderMenu[item].allowedRoles.includes(role) && (
        <Menu.Item key={siderMenu[item].link} icon={siderMenu[item].icon}>
          <span>{siderMenu[item].label}</span>
        </Menu.Item>
      )
    );
  });

  return (
    <Sider
      trigger={null}
      collapsible
      width={250}
      theme="light"
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        height: "100vh",
        position: "fixed",
        left: 0,
      }}
    >
      <div className="app-layout-sider-header d-flex">
        <img className="u-logo" src={logo} alt="Halifax Foodie" />
      </div>
      <div className="app-sidebar-content">
        <Menu
          theme="lite"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          selectedKeys={[pathname]}
          defaultSelectedKeys={[ROUTES.MAIN]}
          onSelect={onMenuSelect}
        >
          {renderSider}
        </Menu>
      </div>
    </Sider>
  );
}

export default AppSidebar;
