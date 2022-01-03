import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

//! Ant Imports

import { Form, Input, Button, Typography, Select } from "antd";

//! Ant Icons

import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";

//! User Files

import { toast } from "common/utils";
import { AppContext } from "AppContext";
import { REGEX, ROUTES } from "common/constants";
import api from "common/api";
import { isEmpty } from "lodash";

const { Title } = Typography;
const { Option } = Select;

function RestaurantSignup() {
  const {
    state: { authenticated },
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [valid, setValid] = useState(false);
  const { push } = useHistory();
  const onFinish = async (values) => {
    const {
      displayName,
      email,
      password,
      prefix,
      phoneNumber,
      questionId,
      answer,
    } = values;
    setLoading(true);
    try {
      const userDetails = {
        displayName,
        password,
        email,
        phoneNumber: `${prefix}${phoneNumber}`,
        role: "admin",
        questionId,
        answer: answer.toLowerCase(),
      };
      const response = await api.post("/users", userDetails);
      const { data } = response;
      if (data.uid && !isEmpty(data.uid)) {
        toast({
          message: "Restaurant registered successfully",
          type: "success",
        });
        push(ROUTES.LOGIN);
      }
    } catch (err) {
      toast({
        message: err.response.data.message,
        type: "error",
      });
    }
    setLoading(false);
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get("/questions");
      setQuestions(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (authenticated) {
      push("/");
    }
    fetchQuestions();
    // eslint-disable-next-line
  }, [authenticated]);

  const renderQuestions =
    questions &&
    questions.length &&
    questions.map((securityQuestion) => {
      const { question_id, question } = securityQuestion;
      return (
        <Option key={question_id} value={question_id}>
          {question}
        </Option>
      );
    });

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="91">+91</Option>
        <Option value="1">+1</Option>
      </Select>
    </Form.Item>
  );

  const handleChange = (e) => {
    const { value } = e.target;
    if (value.toLowerCase() === "group7") {
      setValid(true);
    }
  };

  const AskPassword = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Title level={4} className="sdp-text-strong">
        Enter Password to access this page
      </Title>
      <Input.Password
        prefix={<LockOutlined className="site-form-item-icon" />}
        type="password"
        style={{
          width: 400,
        }}
        onChange={handleChange}
        placeholder="Enter Security Code"
      />
    </div>
  );

  if (!valid) return <AskPassword />;
  return (
    <div className="login">
      <Title level={3} className="sdp-text-strong">
        Restaurant Signup
      </Title>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ prefix: "+91" }}
        onFinish={onFinish}
      >
        <Form.Item
          name="displayName"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Restaurant Name"
          />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid a email!",
            },
            { required: true, message: "Please enter your email" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Please enter your password!" },
            {
              pattern: REGEX.PASSWORD,
              message:
                "Password must contain combination of lowercase, uppercase, special characters",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          rules={[
            { required: true, message: "Please input your phone number!" },
            { pattern: REGEX.PHONE, message: "Please enter valid number!" },
          ]}
        >
          <Input
            placeholder="Phone Number"
            addonBefore={prefixSelector}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="questionId"
          rules={[{ required: true, message: "Please select question!" }]}
        >
          <Select placeholder="Select security question">
            {renderQuestions}
          </Select>
        </Form.Item>
        <Form.Item
          name="answer"
          rules={[
            { required: true, message: "Please enter answer" },
            { min: 3, message: "At least 3 characters required" },
          ]}
        >
          <Input placeholder="Answer" />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Register
          </Button>
          <div className="reg-user-actions">
            <Link to={ROUTES.LOGIN}>Already a user!</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RestaurantSignup;
