import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUsers, getUsers } from "../http/api";
import type { CreatedUserData, User } from "../types";
import { useAuthStore } from "../store";
import UserFilter from "./users/UserFilter";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import UserForm from "./users/forms/UserForm";

const columns = [
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },
];

function UserPage() {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [drawerOpen, setDrawersOpen] = useState(false);

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getUsers().then((res) => {
        return res.data.users;
      });
    },
  });

  const { user } = useAuthStore();

  const { mutate: userMutate } = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: CreatedUserData) =>
      createUsers(data).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    console.log("forms value ", form.getFieldsValue());
    await userMutate(form.getFieldsValue());
    form.resetFields();
    setDrawersOpen(() => false);
  };

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Breadcrumb
          items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]}
          separator={<RightOutlined />}
        />
        <UserFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log({ filterName, filterValue });
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawersOpen(() => true)}
          >
            Add User
          </Button>
        </UserFilter>
        {isLoading && <h1>Loading...</h1>}
        {isError && <div>{error.message}</div>}

        <Table columns={columns} dataSource={users} rowKey="id" />

        <Drawer
          title="create user"
          styles={{ body: { background: colorBgLayout } }}
          width={720}
          destroyOnHidden={true}
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setDrawersOpen(() => false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawersOpen(() => false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <UserForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
}

export default UserPage;
