import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import Icon, {
  HomeOutlined,
  UserOutlined,
  BranchesOutlined,
  ProductOutlined,
  CodeSandboxCircleFilled,
  BellFilled,
} from "@ant-design/icons";
import { useState } from "react";
import AppLogo from "../assets/Logo/AppLogo.svg";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";

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

  const { user, logout: logoutFromStore } = useAuthStore();

  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: async () => {
      logoutFromStore();
      return;
    },
  });

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
          <Header style={{ padding: "0 26px", background: colorBgContainer }}>
            <Flex gap="middle" align="start" justify="space-between">
              <Badge
                text={
                  user.role === "admin"
                    ? "You are an admin"
                    : user?.tenant?.name
                }
                status="success"
              />
              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled />
                </Badge>
                <Dropdown
                  placement="bottomRight"
                  menu={{
                    items: [
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: () => logoutMutate(),
                      },
                    ],
                  }}
                >
                  <Avatar style={{ background: "#fde3cf", color: "#f56a00" }}>
                    U
                  </Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "24px 16px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>Mernspace pizza shop</Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default Dashboard;
