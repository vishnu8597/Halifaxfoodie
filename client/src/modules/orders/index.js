import { useContext, useEffect, useState } from "react";
import moment from "moment";

//! Ant Imports

import { Table, Tag } from "antd";

//! User Files

import { AppContext } from "AppContext";
import api from "common/api";
import { toast } from "common/utils";
import Error404 from "Error404";
import { ORDER_STATUS, ROLES } from "common/constants";
import { LoadingOutlined } from "@ant-design/icons";
import OrderStatusForAdmin from "./components/OrderStatusForAdmin";

function MyOrders() {
  const {
    state: { role, authToken, userId },
  } = useContext(AppContext);
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  const path = role === ROLES.ADMIN ? "restaurant" : "user";

  const fetchOrdersList = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/${path}/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const { data } = response;
      setOrdersList(data);
    } catch (err) {
      setErr(true);
      toast({
        message: "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersList();
    // eslint-disable-next-line
  }, []);

  const columns = [
    {
      title: "Order Id",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "Amount",
      dataIndex: "order_amount",
      key: "order_amount",
      render: (amount) => {
        return <span>${amount}</span>;
      },
    },
    {
      title: "Last Update",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (updatedAt) => {
        return <span>{moment(updatedAt).fromNow()}</span>;
      },
    },
    {
      title: "Order Details",
      dataIndex: "order_id",
      key: "order_id",
      render: (order_id, record) => {
        return (
          <a
            href={`/order/${record.order_id}`}
            target="_blank"
            rel="noreferrer"
          >
            Order Details
          </a>
        );
      },
    },
    {
      title: "Order Status",
      dataIndex: "order_status",
      key: "order_status",
      render: (order_status, record) => {
        let color = "volcano";
        if (ORDER_STATUS[order_status] === ORDER_STATUS.DELIVERED) {
          color = "green";
        } else if (ORDER_STATUS[order_status] === ORDER_STATUS.DISPATCHED) {
          color = "geekblue";
        }
        return role === ROLES.ADMIN ? (
          <OrderStatusForAdmin record={record} />
        ) : (
          <Tag color={color}>{ORDER_STATUS[order_status]}</Tag>
        );
      },
    },
  ];

  if (err) return <Error404 />;
  return (
    <div>
      <div className="mx-1 sdp-text-strong heading">Order Details</div>
      <Table
        loading={{ spinning: loading, indicator: <LoadingOutlined /> }}
        className="bank-user-table"
        columns={columns}
        pagination={false}
        dataSource={ordersList}
        sticky
        rowKey="order_id"
      />
    </div>
  );
}

export default MyOrders;
