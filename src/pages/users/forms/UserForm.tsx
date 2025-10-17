import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import type { Tenant } from "../../../types";

function UserForm() {
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants().then((res) => res.data);
    },
  });

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Basic info" variant="borderless">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="First Name" name="firstName">
                  <Input size="large" placeholder="First Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last Name" name="lastName">
                  <Input size="large" placeholder="Last Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <Input size="large" placeholder="Email" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Security info" variant="borderless">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Password" name="password">
                  <Input size="large" type="password" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Role" variant="borderless">
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="Role" name="role">
                  <Select
                    size="large"
                    allowClear={true}
                    style={{ width: "100%" }}
                    placeholder="Select role"
                    onChange={() => {}}
                  >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="manager">User</Select.Option>
                    <Select.Option value="customer">Customer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Restaurant" name="tenantId">
                  <Select
                    size="large"
                    allowClear={true}
                    style={{ width: "100%" }}
                    placeholder="Select Restaurant"
                    onChange={() => {}}
                  >
                    {tenants?.map((tenant: Tenant) => {
                      <Select.Option value={tenant.id}>
                        {tenant.name}
                      </Select.Option>;
                    })}
                    <Select.Option value="restaurant 1">
                      Restaurant 1
                    </Select.Option>
                    <Select.Option value="restaurant 2">
                      Restaurant 2
                    </Select.Option>
                    <Select.Option value="restaurant 3">
                      Restaurant 3
                    </Select.Option>
                    <Select.Option value="restaurant 4">
                      Restaurant 4
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
}

export default UserForm;
