//! Ant Icons

import {
  UserOutlined,
  AppstoreOutlined,
  WechatOutlined,
  ShopOutlined,
  // FileTextOutlined,
  ContainerOutlined,
  SearchOutlined,
  CloudOutlined,
} from "@ant-design/icons";

//! User Files

import { MODULES, ROLES, ROUTES } from "./constants";

export const rootSubMenuKeys = ["Dashboard", "Profile", "Chat", "Restaurants"];

export const siderMenu = {
  Dashboard: {
    link: ROUTES.MAIN,
    label: MODULES.DASHBOARD,
    allowedRoles: [ROLES.USER, ROLES.ADMIN],
    icon: <AppstoreOutlined />,
  },
  Profile: {
    link: ROUTES.PROFILE,
    label: MODULES.PROFILE,
    allowedRoles: [ROLES.USER, ROLES.ADMIN],
    icon: <UserOutlined />,
  },
  Chat: {
    link: ROUTES.CHAT,
    label: MODULES.CHAT,
    allowedRoles: [ROLES.USER, ROLES.ADMIN],
    icon: <WechatOutlined />,
  },
  Restaurants: {
    link: ROUTES.RESTAURANTS,
    label: MODULES.RESTAURANTS,
    allowedRoles: [ROLES.USER],
    icon: <ShopOutlined />,
  },
  // Menu: {
  //   link: ROUTES.FOOD_MENU,
  //   label: MODULES.FOOD_MENU,
  //   allowedRoles: [ROLES.ADMIN],
  //   icon: <FileTextOutlined />,
  // },
  // "Explore Dishes": {
  //   link: ROUTES.USER_FOOD_MENU,
  //   label: MODULES.USER_FOOD_MENU,
  //   allowedRoles: [ROLES.USER],
  //   icon: <FileTextOutlined />,
  // },
  "Word Cloud": {
    link: ROUTES.WORD_CLOUD,
    label: MODULES.WORD_CLOUD,
    allowedRoles: [ROLES.USER, ROLES.ADMIN],
    icon: <CloudOutlined />,
  },
  Orders: {
    link: ROUTES.ORDERS,
    label: MODULES.ORDERS,
    allowedRoles: [ROLES.USER, ROLES.ADMIN],
    icon: <ContainerOutlined />,
  },
  "Track Orders": {
    link: ROUTES.TRACK_ORDER,
    label: MODULES.TRACK_ORDER,
    allowedRoles: [ROLES.USER],
    icon: <SearchOutlined />,
  },
};
