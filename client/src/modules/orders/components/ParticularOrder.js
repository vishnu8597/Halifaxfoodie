import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

//! Ant Imports

import { Button, Card, Descriptions, Input, PageHeader, Rate } from "antd";

//! User Files

import { AppContext } from "AppContext";
import api from "common/api";
import { ORDER_STATUS, ROLES } from "common/constants";
import { toast } from "common/utils";
import Loading from "components/Loading";
import Error404 from "Error404";
import FoodItems from "modules/food_items";
import { isEmpty } from "lodash";

function ParticularOrder() {
  const {
    state: { authToken, role, userId },
  } = useContext(AppContext);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userReview, setUserReview] = useState("");
  const [rating, setRating] = useState(0);
  const [orderReview, setOrderReview] = useState({});
  const [orderData, setOrderData] = useState({});
  const [orderLoading, setOrderLoading] = useState(false);
  const [err, setErr] = useState(false);
  const params = useParams();

  const orderId = params?.orderId;
  const orderStatus = orderData?.order_status;
  const restaurantName = orderData?.restaurant_name;
  const updatedAt = orderData?.updated_at;
  const orderAmount = orderData?.order_amount;
  const orderItems = orderData?.orderItems;
  const uid = orderData?.uid;

  const desc = ["Terrible", "Bad", "Normal", "Good", "Wonderful"];

  const handleUserReview = ({ target: { value } }) => {
    setUserReview(value);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleSubmitReview = async () => {
    setReviewLoading(true);
    try {
      if (isEmpty(userReview) || rating === 0) {
        toast({
          message: "Review or rating is empty",
          type: "info",
        });
      } else {
        const payload = {
          orderId,
          review: userReview,
          rating,
        };
        const response = await api.post("/order/reviews", payload);
        const { data } = response;
        toast({
          message: data.message,
          type: "success",
        });
        setOrderReview({
          given: 1,
          review: {
            comment: userReview,
            rating,
            user_id: userId,
            order_id: orderId,
          },
        });
      }
    } catch (err) {
      toast({
        message: err.message,
        type: "error",
      });
    }
    setReviewLoading(false);
  };

  const fetchOrderData = async () => {
    setOrderLoading(true);
    try {
      const orderResponse = await api.get(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const { data } = orderResponse;
      setOrderData(data);

      const reviewResponse = await api.get(`/order/${orderId}/reviews`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const { data: reviewData } = reviewResponse;
      setOrderReview(reviewData);
    } catch (err) {
      setErr(true);
      toast({
        message: "Something went wrong",
        type: "error",
      });
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
    // eslint-disable-next-line
  }, []);

  const renderReviewBox =
    role === ROLES.USER ? (
      userId === uid ? (
        <>
          {orderReview.given ? (
            <>
              <div className="mx-1 sdp-text-strong heading">Review</div>
              <Card>
                <span>
                  <Rate
                    disabled
                    tooltips={desc}
                    value={orderReview.review.rating}
                  />
                </span>
                <div className="mt-1">{orderReview.review.comment}</div>
              </Card>
            </>
          ) : (
            orderStatus === "DELIVERED" && (
              <>
                <div className="mx-1 sdp-text-strong heading">Review</div>
                <Card>
                  <span>
                    <Rate
                      tooltips={desc}
                      onChange={handleRatingChange}
                      value={rating}
                    />
                  </span>
                  <Input.TextArea
                    className="mt-1"
                    placeholder="Write your review here..."
                    rows={6}
                    onChange={handleUserReview}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      style={{ width: 200 }}
                      loading={reviewLoading}
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      onClick={handleSubmitReview}
                    >
                      Review
                    </Button>
                  </div>
                </Card>
              </>
            )
          )}
        </>
      ) : (
        <>
          <div className="mx-1 sdp-text-strong heading">Review</div>
          <Card>You can not review on others orders</Card>
        </>
      )
    ) : (
      orderReview.given === 1 && (
        <>
          <div className="mx-1 sdp-text-strong heading">Review</div>
          <Card>{orderReview.review.comment}</Card>
        </>
      )
    );

  if (orderLoading) return <Loading />;
  if (err) return <Error404 />;
  return (
    <div>
      <div className="mx-1 sdp-text-strong heading">Order Details</div>
      <Card className="mb-1">
        <PageHeader
          title={restaurantName}
          subTitle={<span>Last update: {moment(updatedAt).fromNow()}</span>}
        >
          <Descriptions size="small" column={4}>
            <Descriptions.Item label="Order ID">{orderId}</Descriptions.Item>
            <Descriptions.Item label="Status">
              {ORDER_STATUS[orderStatus]}
            </Descriptions.Item>
            <Descriptions.Item label="Order Total">
              ${orderAmount}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              <a href={`tel:${orderData?.phone_number}`}>
                {orderData?.phone_number}
              </a>
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
      </Card>
      {renderReviewBox}
      <div className="mx-1 sdp-text-strong heading">Dishes</div>
      <FoodItems restaurantFoodItems={orderItems} isOrderPage />
    </div>
  );
}

export default ParticularOrder;
