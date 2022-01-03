import { useContext, useState } from "react";

//! Ant Imports

import { Form, Input, Button, Typography } from "antd";

//! User Files

import { toast } from "common/utils";
import { ORDER_STATUS, REGEX } from "common/constants";
import { AppContext } from "AppContext";
import api from "common/api";

const { Title } = Typography;

function TrackOrder() {
  const {
    state: { authToken },
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { orderId } = values;
    setLoading(true);
    try {
      const response = await api.get(`/orders/${orderId}/track`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const { data } = response;
      toast({
        message: (
          <span>
            Your order with order id {orderId} is
            <span className="sdp-text-strong">
              {" "}
              {ORDER_STATUS[data.order_status]}
            </span>
          </span>
        ),
        type: "info",
        duration: 10,
      });
    } catch (err) {
      if (err.response?.data) {
        toast({
          message: err.response.data.message,
          type: "error",
        });
      } else {
        toast({
          message: err.message,
          type: "error",
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex item-center flex-column justify-space-between">
      <Title level={3} className="sdp-text-strong">
        Track Order
      </Title>
      <Form name="normal_login" className="login-form" onFinish={onFinish}>
        <Form.Item
          name="orderId"
          rules={[
            { required: true, message: "Please enter order id" },
            { pattern: REGEX.NUMBER, message: "Order Id must be a number" },
          ]}
        >
          <Input placeholder="Order Id" />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Get Order Status
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default TrackOrder;
