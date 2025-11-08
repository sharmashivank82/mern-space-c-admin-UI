import {
  Breadcrumb,
  Button,
  Drawer,
  Form,
  Space,
  Spin,
  Table,
  theme,
  Typography,
} from "antd";
import { RightOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createUsers, getUsers, updateUsers } from "../http/api";
import type { CreatedUserData, FieldData, User } from "../types";
import { useAuthStore } from "../store";
import UserFilter from "./users/UserFilter";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import UserForm from "./users/forms/UserForm";
import { PER_PAGE } from "../Constants";
import { debounce } from "lodash";

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
  {
    title: "Restaurant",
    dataIndex: "tenant",
    key: "tenant",
    render: (_text: string, record: User) => {
      return <div>{record.tenant?.name}</div>;
    },
  },
];

function UserPage() {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const queryClient = useQueryClient();

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [queryParams, setQueriesParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
    q: "",
  });

  const [drawerOpen, setDrawersOpen] = useState(false);
  const [currentEditingUser, setCurrentsEditingUser] = useState<User | null>(
    null
  );

  useEffect(() => {
    if (currentEditingUser) {
      setDrawersOpen(() => true);
      form.setFieldsValue({
        ...currentEditingUser,
        tenantId: currentEditingUser?.tenant?.id,
      });
    }
  }, [currentEditingUser, form]);

  const {
    data: users,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      return getUsers(queryString).then((res) => {
        return res.data;
      });
    },
    placeholderData: keepPreviousData,
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

  const { mutate: updateUserMutate } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (data: CreatedUserData) =>
      updateUsers(data, currentEditingUser!.id).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    const isEditMode = !!currentEditingUser;
    if (isEditMode) {
      await updateUserMutate(form.getFieldsValue());
    } else {
      await userMutate(form.getFieldsValue());
    }
    setCurrentsEditingUser(() => null);
    form.resetFields();
    setDrawersOpen(() => false);
  };

  const debouncedQUpdate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      if (value)
        setQueriesParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  const onFilterChange = (changedFields: FieldData[]) => {
    const changeFilterFields = changedFields
      .map((item) => {
        return {
          [item.name[0]]: item.value,
        };
      })
      .reduce((acc, item) => ({ ...acc, ...item }), {});

    if ("q" in changeFilterFields) {
      debouncedQUpdate(changeFilterFields.q);
    } else {
      setQueriesParams((prev) => ({
        ...prev,
        ...changeFilterFields,
        currentPage: 1,
      }));
    }

    console.log({ changeFilterFields });
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
        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <UserFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawersOpen(() => true)}
            >
              Add User
            </Button>
          </UserFilter>
        </Form>
        {isFetching && (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        )}
        {isError && (
          <Typography.Text type="danger">{error.message}</Typography.Text>
        )}

        <Table
          columns={[
            ...columns,
            {
              title: "Actions",
              render: (_: string, record: User) => {
                return (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => {
                        setCurrentsEditingUser(() => record);
                      }}
                    >
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={users?.users}
          rowKey="id"
          pagination={{
            total: users?.count,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              setQueriesParams((prev) => ({
                ...prev,
                currentPage: page,
              }));
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
        />

        <Drawer
          title={currentEditingUser ? "Edit User" : "Add User"}
          styles={{ body: { background: colorBgLayout } }}
          width={720}
          destroyOnHidden={true}
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setDrawersOpen(() => false);
            setCurrentsEditingUser(() => null);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawersOpen(() => false);
                  setCurrentsEditingUser(() => null);
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
            <UserForm isEditMode={!!currentEditingUser} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
}

export default UserPage;
