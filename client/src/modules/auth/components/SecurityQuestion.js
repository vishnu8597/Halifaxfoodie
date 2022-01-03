import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

//! Ant Imports

import { Form, Input, Button, Typography } from "antd";

//! User Files

import { toast } from "common/utils";
import { AppContext } from "AppContext";
import * as ActionTypes from "common/actionTypes";
import { ROUTES } from "common/constants";
import api from "common/api";
import Loading from "components/Loading";
import { isEmpty } from "lodash";

const { Title } = Typography;

function SecurityQuestion() {
  const {
    state: { authenticated },
    dispatch,
  } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState({});
  const { push, location } = useHistory();
  const onFinish = async (values) => {
    const { answer } = values;
    if (answer.toLowerCase() === securityQuestionAnswer.answer) {
      if (isEmpty(location.state.currentUser)) {
        push(ROUTES.LOGIN);
      } else {
        const { currentUser } = location.state;
        dispatch({ type: ActionTypes.SET_TOKEN, data: currentUser.token });
        dispatch({ type: ActionTypes.SET_CURRENT_USER, data: currentUser });
        dispatch({ type: ActionTypes.SET_USER_ID, data: currentUser.uid });
        dispatch({ type: ActionTypes.SET_AUTHENTICATED, data: true });
        dispatch({ type: ActionTypes.SET_ROLE, data: currentUser.role });
        dispatch({ type: ActionTypes.SET_CART, data: [] });
        dispatch({
          type: ActionTypes.SET_USER_IMAGE,
          data: currentUser.imageUrl,
        });
      }
    } else {
      toast({
        message: "Please enter correct answer!",
        type: "error",
      });
    }
  };

  const fetchAnswerOfUser = async () => {
    setLoading(true);
    if (isEmpty(location.state.currentUser)) {
      push(ROUTES.LOGIN);
    } else {
      const { uid, role } = location.state.currentUser;
      try {
        const response = await api.post(
          "https://xhdt9h76vl.execute-api.us-east-1.amazonaws.com/Test/security-questions",
          { uid, role }
        );
        setSecurityQuestionAnswer(response.data);
      } catch (error) {
        toast({
          message: "Something went wrong",
          type: "error",
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    if (authenticated) {
      if (mounted) {
        push("/");
      }
    }
    fetchAnswerOfUser();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line
  }, [authenticated]);

  if (loading) return <Loading />;
  return (
    <div className="login">
      <Title level={3} className="sdp-text-strong">
        Security Question
      </Title>
      <Title level={5}>{securityQuestionAnswer.question}</Title>
      <Form name="normal_login" className="login-form" onFinish={onFinish}>
        <Form.Item
          name="answer"
          rules={[{ required: true, message: "Please enter your answer" }]}
        >
          <Input placeholder="Answer" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SecurityQuestion;
