import { Breadcrumb } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../http/api";
import type { User } from "../types";

function UserPage() {
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

  return (
    <>
      <Breadcrumb
        items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]}
        separator={<RightOutlined />}
      />
      {isLoading && <h1>Loading...</h1>}
      {isError && <div>{error.message}</div>}
      {users && (
        <div>
          <h1>Users</h1>
          <ul>
            {users?.map((user: User) => {
              return <li key={user.id}>{user.firstName}</li>;
            })}
          </ul>
        </div>
      )}
    </>
  );
}

export default UserPage;
