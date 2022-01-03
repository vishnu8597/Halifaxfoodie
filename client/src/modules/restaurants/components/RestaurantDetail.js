import moment from "moment";

//! Ant Imports

import { PageHeader, Tag, Descriptions, Card } from "antd";

function RestaurantDetail({ restaurantDetail, dishesOffered }) {
  return (
    <Card className="mb-1">
      <PageHeader
        className="site-page-header"
        onBack={() => window.history.back()}
        title={restaurantDetail?.restaurant_name}
        tags={
          <Tag color={dishesOffered > 0 ? "blue" : "default"}>
            {dishesOffered > 0 ? "Open" : "Closed"}
          </Tag>
        }
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Created By">
            HalifaxFoodie Portal
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            <a href={`tel:${restaurantDetail?.phone_number}`}>
              {restaurantDetail?.phone_number}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="Effective Time">
            {moment(restaurantDetail?.created_at).format(
              "MMMM Do YYYY, h:mm:ss a"
            )}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
    </Card>
  );
}

export default RestaurantDetail;
