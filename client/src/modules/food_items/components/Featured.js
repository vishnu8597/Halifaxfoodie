//! Ant Imports

import { Button, Space } from "antd";

//! Ant Icons

import { StarFilled, StarOutlined } from "@ant-design/icons";

function Featured({ itemData, handleFeaturedClick, updateLoading }) {
  const IconText = ({ text }) => (
    <Space>
      <Button
        type="ghost"
        size="small"
        shape="circle"
        disabled={updateLoading}
        onClick={() => handleFeaturedClick(itemData)}
      >
        {itemData.featured ? <StarFilled /> : <StarOutlined />}
      </Button>
      {text}
    </Space>
  );

  return (
    <IconText
      text={itemData.featured ? "Featured" : ""}
      key="list-vertical-star-o"
    />
  );
}

export default Featured;
