import { Button, Card, Checkbox, Form, Input, Layout, Space } from "antd";
import { LockFilled, UserOutlined, LockOutlined } from "@ant-design/icons";
import AppLogo from "../../assets/Logo/AppLogo.svg";

function LoginPage() {
  return (
    <>
      <Layout
        style={{ height: "100vh", display: "grid", placeItems: "center" }}
      >
        <Space direction="vertical" align="center" size={"large"}>
          <Layout.Content
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={AppLogo} alt="" style={{ height: 23 }} />
          </Layout.Content>
          <Card
            title={
              <Space
                style={{
                  width: "100%",
                  fontSize: 16,
                  justifyContent: "center",
                }}
              >
                <LockFilled />
                Sign In
              </Space>
            }
            variant="borderless"
            style={{ width: "300px" }}
          >
            <Form>
              <Form.Item name="username">
                <Input placeholder="Username" prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item name="password">
                <Input.Password
                  placeholder="Password"
                  prefix={<LockOutlined />}
                />
              </Form.Item>
              <Form.Item name="remember">
                <Checkbox>Remember me</Checkbox>
                <a href="#">Forgot Password</a>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </>
  );
}

export default LoginPage;
