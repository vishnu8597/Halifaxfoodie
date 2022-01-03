import { useContext, useState } from "react";
import isEmpty from "lodash/isEmpty";

//! Ant Icons

import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

//! Ant Imports

import { Button, Input, Modal, Form, Checkbox, Typography } from "antd";

//! User Files

import { REGEX } from "common/constants";
import api from "common/api";
import { AppContext } from "AppContext";
import { toast } from "common/utils";

const { Title } = Typography;

function AddItem() {
  const {
    state: { userId },
  } = useContext(AppContext);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [foodImage, setFoodImage] = useState({});

  const [form] = Form.useForm();

  const showModal = () => {
    setVisible(true);
  };

  const onCheckboxChange = (e) => {
    setFeatured(e.target.checked);
  };

  const handleDishCreate = async (values) => {
    if (isEmpty(foodImage?.name)) {
      toast({
        message: "Please upload image of the food item",
        type: "error",
      });
    } else {
      values.featured = featured;
      setConfirmLoading(true);
      try {
        const response = await api.post(
          `/food-item/restaurant/${userId}`,
          values
        );
        const { data } = response;
        const insertedId = data.itemId;
        const formData = new FormData();
        formData.append("foodImage", foodImage, foodImage.name);
        const foodImageResponse = await api.post(
          `food-item/${insertedId}/image`,
          formData
        );
        const { data: foodImageUploadData } = foodImageResponse;
        toast({
          message: foodImageUploadData.message,
          type: "success",
        });
        setVisible(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (err) {
        toast({
          message: err.message,
          type: "error",
        });
      } finally {
        setConfirmLoading(false);
      }
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        handleDishCreate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleUpload = (e) => {
    const fileInput = document.getElementById("foodImageInput");
    fileInput.click();
  };

  const onChange = (e) => {
    // TODO: If size is greater than 3 MB, throw Error
    const image = e.target.files[0];
    setFoodImage(image);
  };

  const handleChangeImage = () => {
    setFoodImage({});
  };

  const title = <span className="sdp-text-strong">Add new food item</span>;
  return (
    <div className="add-item">
      <Title level={4} className="sdp-text-strong ml-1">
        Menu
      </Title>
      <Button icon={<PlusOutlined />} onClick={showModal} type="primary">
        ADD DISH
      </Button>
      <Modal
        title={title}
        centered
        visible={visible}
        onOk={handleOk}
        okText="Add Item"
        closable={false}
        keyboard={false}
        maskClosable={false}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        cancelButtonProps={{ disabled: confirmLoading }}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="itemName"
            label="Dish Name"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
              {
                pattern: REGEX.NUMBER,
                message: "Price must be a number",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="recipe"
            label="Recipe"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="ingredients"
            label="Ingredients"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="preparationTime"
            label="Preparation Time"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
              {
                pattern: REGEX.NUMBER,
                message: "Price must be a number",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <div className="mx-1">
            <input type="file" id="foodImageInput" hidden onChange={onChange} />
            {isEmpty(foodImage?.name) ? (
              <Button icon={<UploadOutlined />} onClick={handleUpload}>
                Upload Food Image
              </Button>
            ) : (
              <>
                <span className="sdp-text-strong mr-1">
                  Uploaded {foodImage.name}
                </span>
                <Button type="dashed" onClick={handleChangeImage}>
                  Click to change
                </Button>
              </>
            )}
          </div>
          <Form.Item>
            <Checkbox checked={featured} onChange={onCheckboxChange}>
              Featured
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddItem;
