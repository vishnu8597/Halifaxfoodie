import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import _ from "lodash";

//! Ant Imports

import { List, Avatar, Button, Drawer, Input } from "antd";

//! User Files

import * as ActionTypes from "common/actionTypes";
import { AppContext } from "AppContext";
import { DeleteFilled, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import api from "common/api";
import { toast } from "common/utils";
import { discountCodes } from "common/constants";
const { Search } = Input;

function MyCartDrawer({ onClose, visible }) {
  const {
    state: { cart },
    dispatch,
  } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const { push } = useHistory();
  const [discount, setDiscount] = useState(1);

  const removeItem = (id) => {
    setDiscount(1);
    const updatedCart = cart.filter((item) => item.itemId !== id);
    dispatch({ type: ActionTypes.SET_CART, data: updatedCart });
  };

  const addQty = (item) => {
    const itemIndex = _.findIndex(cart, (foodItem) => {
      return foodItem.itemId === item.itemId;
    });
    cart[itemIndex] = {
      ...cart[itemIndex],
      quantity: cart[itemIndex].quantity + 1,
      totalPrice: cart[itemIndex].totalPrice + item.price,
    };
    dispatch({ type: ActionTypes.SET_CART, data: cart });
  };

  const subtractQty = (item) => {
    if (item.quantity === 1) {
      removeItem(item.itemId);
    } else {
      const itemIndex = _.findIndex(cart, (foodItem) => {
        return foodItem.itemId === item.itemId;
      });
      cart[itemIndex] = {
        ...cart[itemIndex],
        quantity: cart[itemIndex].quantity - 1,
        totalPrice: cart[itemIndex].totalPrice - item.price,
      };
      dispatch({ type: ActionTypes.SET_CART, data: cart });
    }
  };

  const orderAmount = (
    discount *
    _.sumBy(cart, (orderItem) => {
      return orderItem.totalPrice;
    })
  ).toFixed(2);

  const handleOrder = async () => {
    const orderData = {
      orderAmount,
      restaurantId: cart[0].restaurantId,
      orderItems: cart,
    };
    setLoading(true);
    try {
      const response = await api.post("/orders", orderData);
      const { data } = response;
      const { message, orderId } = data;
      onClose();
      dispatch({ type: ActionTypes.SET_CART, data: [] });
      toast({
        message,
        type: "success",
      });
      push(`/order/${orderId}`);
    } catch (err) {
      toast({
        message: err.message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (value) => {
    const resultDiscountCode = discountCodes.map(({ code }) => code);
    if (resultDiscountCode.includes(value.toUpperCase())) {
      const index = _.findIndex(discountCodes, function (coupon) {
        return coupon.code === value.toUpperCase();
      });
      toast({
        message: "Coupon applied successfully",
        type: "success",
      });
      setDiscount((100 - discountCodes[index].discount) / 100);
    } else {
      toast({
        message: "No coupon found",
        type: "error",
      });
    }
  };

  const title = <span className="sdp-text-strong">My Cart</span>;

  const footer = cart.length > 0 && (
    <div className="flex item-center justify-space-between">
      <div>
        <span className="sdp-text-strong">Total: </span>
        <span>${orderAmount}</span>
      </div>
      <div>
        <Search
          placeholder="Discount Coupon"
          allowClear
          enterButton="Apply"
          onSearch={onSearch}
        />
      </div>
      <Button type="primary" onClick={handleOrder} loading={loading}>
        Order
      </Button>
    </div>
  );

  return (
    <Drawer
      title={title}
      placement="right"
      width={550}
      onClose={onClose}
      visible={visible}
      footer={footer}
    >
      <List
        itemLayout="horizontal"
        dataSource={cart}
        locale={{ emptyText: "Your cart is empty!" }}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  shape="square"
                  style={{ width: 75, height: 75, objectFit: "cover" }}
                  src={item.foodPhotoUrl}
                />
              }
              title={
                <div className="flex item-center justify-space-between">
                  <span className="sdp-text-strong">{item.itemName}</span>
                  <Button
                    type="ghost"
                    size="small"
                    danger
                    onClick={() => removeItem(item.itemId)}
                    icon={<DeleteFilled />}
                  />
                </div>
              }
              description={
                <div className="flex">
                  <div>
                    <div className="px mr-1">
                      <span className="sdp-text-strong">Qty: </span>
                      <Button
                        type="ghost"
                        size="small"
                        onClick={() => subtractQty(item)}
                        icon={<MinusOutlined />}
                      />
                      <span className="mx-8">{item.quantity}</span>
                      <Button
                        type="ghost"
                        size="small"
                        onClick={() => addQty(item)}
                        icon={<PlusOutlined />}
                      />
                    </div>
                    <div className="px">
                      <span className="sdp-text-strong">Item Total: </span>$
                      {(discount * item.totalPrice).toFixed(2)}
                    </div>
                  </div>
                  <div className="px">
                    <span className="sdp-text-strong">Price: </span>$
                    {(discount * item.price).toFixed(2)}
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
}

export default MyCartDrawer;
