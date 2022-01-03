import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";

//! Ant Imports

import { Form, Input, Button, Typography } from "antd";

//! Ant Icons

import { MailOutlined, LockOutlined } from "@ant-design/icons";

//! User Files

import { auth } from "_firebase";
import { toast } from "common/utils";
import { AppContext } from "AppContext";
import { ROUTES } from "common/constants";

const { Title } = Typography;

function Login() {
  const {
    state: { authenticated },
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const { push } = useHistory();
  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const userAuth = await auth.signInWithEmailAndPassword(email, password);
      const { user } = userAuth;
      const token = await user.getIdToken();
      const decoded = jwtDecode(token);
      const currentUser = {
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        uid: user.uid,
        metadata: user.metadata,
        token,
        role: decoded.role,
        imageUrl: decoded.picture ? decoded.picture : null,
      };
      push(ROUTES.SECURITY_QUESTION, { currentUser });
    } catch (err) {
      toast({
        message: err.message,
        type: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      push("/");
    }
    // eslint-disable-next-line
  }, [authenticated]);

  return (
    <div className="login">
      <Title level={3} className="sdp-text-strong">
        Halifax Foodie
      </Title>
      <Form name="normal_login" className="login-form" onFinish={onFinish}>
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
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Next
          </Button>
          <div className="user-actions">
            <Link to={ROUTES.FORGET_PASSWORD}>Forget Password?</Link>
            <Link to={ROUTES.REGISTER}>Register Now!</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
