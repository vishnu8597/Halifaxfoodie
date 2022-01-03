import { useContext, useState } from "react";

//! Ant Imports

import { Menu, Dropdown, Button } from "antd";

//! Ant Icons

import { DownOutlined } from "@ant-design/icons";

//! User Files

import { ORDER_STATUS } from "common/constants";
import { toast } from "common/utils";
import api from "common/api";
import { AppContext } from "AppContext";

function OrderStatusForAdmin({ record }) {
  const {
    state: { userId },
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState(
    ORDER_STATUS[record.order_status]
  );

  const getKeyByValue = (object, value) => {
    return Object.keys(object).find((key) => object[key] === value);
  };

  const handleMenuClick = async (e) => {
    const status = getKeyByValue(ORDER_STATUS, e.key);
    setLoading(true);
    const updateData = {
      orderStatus: status,
    };
    try {
      const response = await api.patch(
        `/orders/${record.order_id}/restaurant/${userId}`,
        updateData
      );
      const { data } = response;
      toast({
        message: data.message,
        type: "success",
      });
      setButtonText(e.key);
    } catch (error) {
      toast({
        message: "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key={ORDER_STATUS.PREPARING}>Preparing</Menu.Item>
      <Menu.Item key={ORDER_STATUS.DISPATCHED}>Dispatched</Menu.Item>
      <Menu.Item key={ORDER_STATUS.DELIVERED}>Delivered</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <Button loading={loading}>
        {buttonText} <DownOutlined />
      </Button>
    </Dropdown>
  );
}

export default OrderStatusForAdmin;
