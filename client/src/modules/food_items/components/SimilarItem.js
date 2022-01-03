import { useState } from "react";

//! Ant Imports

import { Button, Modal, List } from "antd";

//! Ant Icons

import { LoadingOutlined } from "@ant-design/icons";

//! User Files

import api from "common/api";

function SimilarItem({ itemData }) {
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
    handleSimilarItems(itemData);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const itemName = itemData.item_name;

  const handleSimilarItems = async (item) => {
    setLoading(true);
    try {
      const response = await api.post(
        "https://us-central1-decent-blade-305221.cloudfunctions.net/function-2",
        {
          message: item.ingredients,
        }
      );

      const { data } = response;
      setSuggestions(data.message || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={showModal} type="link">
        Show Similar Dishes
      </Button>
      <Modal
        title={`Similar item to ${itemName}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="similar-recipe"
      >
        <List
          loading={{ spinning: loading, indicator: <LoadingOutlined /> }}
          itemLayout="horizontal"
          dataSource={suggestions}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <span className="sdp-text-strong">{item.food_item}</span>
                }
                description={item.cuisine.toUpperCase()}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}

export default SimilarItem;
