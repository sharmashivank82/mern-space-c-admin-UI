import { Card, Col, Form, Input, Row, Select } from "antd";
import type React from "react";

type UsersFilterProps = {
  children: React.ReactNode;
};

function UserFilter({ children }: UsersFilterProps) {
  return (
    <>
      <Card>
        <Row justify="space-between">
          <Col span={16}>
            <Row gutter={20}>
              <Col span={8}>
                <Form.Item name="q">
                  <Input.Search
                    allowClear={true}
                    placeholder="Search"
                    // onChange={(e) =>
                    //   onFilterChange("searchFilter", e.target.value)
                    // }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="role">
                  <Select
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select role"
                    // onChange={(selectedItem) =>
                    //   onFilterChange("roleFilter", selectedItem)
                    // }
                  >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="manager">User</Select.Option>
                    <Select.Option value="customer">Customer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col span={8}>
                <Select
                  allowClear={true}
                  style={{ width: "100%" }}
                  placeholder="status"
                  onChange={(selectedItem) =>
                    onFilterChange("statusFilter", selectedItem)
                  }
                >
                  <Select.Option value="ban">Ban</Select.Option>
                  <Select.Option value="active">Active</Select.Option>
                </Select>
              </Col> */}
            </Row>
          </Col>
          <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
            {children}
          </Col>
        </Row>
      </Card>
    </>
  );
}

export default UserFilter;
