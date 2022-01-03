//! Ant Imports

import Layout from "antd/lib/layout";

//! User Files

import AppHeader from "./components/header/AppHeader";
import AppSidebar from "./components/sidebar/AppSidebar";
import ContentRoutes from "./ContentRoutes";
import "./App.less";

const { Content } = Layout;

const App = () => {
  return (
    <Layout className="app-layout">
      <AppSidebar />
      <Layout style={{ marginLeft: 250 }}>
        <AppHeader />
        <Content className="app-content">
          <div className="app-content-wrapper">
            <ContentRoutes />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
