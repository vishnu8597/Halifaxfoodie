import { useState } from "react";

//! Ant Imports

import { Button, Popconfirm } from "antd";

//! Ant Icons

import { DeleteFilled } from "@ant-design/icons";

function DeleteItem({ itemData, handleDeleteItem, deleteLoading }) {
  const [visible, setVisible] = useState(false);

  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleOk = () => {
    handleDeleteItem(itemData);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Popconfirm
      title={
        <span className="sdp-text-strong">
          Are you sure, you want to delete {itemData.item_name}
        </span>
      }
      visible={visible}
      onConfirm={handleOk}
      okButtonProps={{ loading: deleteLoading }}
      okText="Delete"
      onCancel={handleCancel}
    >
      <Button
        type="ghost"
        size="small"
        shape="circle"
        onClick={showPopconfirm}
        icon={<DeleteFilled />}
      />
    </Popconfirm>
  );
}

export default DeleteItem;
