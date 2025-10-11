import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import { Layout, Menu, theme } from "antd";
import Icon, {
  HomeOutlined,
  UserOutlined,
  BranchesOutlined,
  ProductOutlined,
  CodeSandboxCircleFilled,
} from "@ant-design/icons";
import { useState } from "react";
import AppLogo from "../assets/Logo/AppLogo.svg";

const { Sider, Content, Footer, Header } = Layout;

const items = [
  {
    key: "/",
    icon: <Icon component={HomeOutlined} />,
    label: <NavLink to="/">Home</NavLink>,
  },
  {
    key: "/users",
    icon: <Icon component={UserOutlined} />,
    label: <NavLink to="/users">Users</NavLink>,
  },
  {
    key: "/restaurants",
    icon: <Icon component={BranchesOutlined} />,
    label: <NavLink to="/restaurants">Restaurants</NavLink>,
  },
  {
    key: "/products",
    icon: <ProductOutlined />,
    label: <NavLink to="/products">Products</NavLink>,
  },
  {
    key: "/promos",
    icon: <CodeSandboxCircleFilled />,
    label: <NavLink to="/promos">Promos</NavLink>,
  },
];

function Dashboard() {
  const [collapsed, setCollapse] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { user } = useAuthStore();
  if (user === null) {
    return <Navigate to="/auth/login" replace={true} />;
  }

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapse(value)}
          theme="light"
        >
          <div className="logo">
            <img src={AppLogo} alt="" />
          </div>
          <Menu
            theme="light"
            defaultSelectedKeys={["/"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: "0 16px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>Mernspace pizza shop</Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default Dashboard;
