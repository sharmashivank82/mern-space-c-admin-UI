import { Outlet } from "react-router-dom";
import { self } from "../http/api";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store";
import { useEffect } from "react";
import { AxiosError } from "axios";

const getSelf = async () => {
  // Server call logic
  const res = await self();
  return res?.data;
};

function Root() {
  const { setUser } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }
      return failureCount < 3 ? true : false;
    },
  });

  useEffect(() => {
    console.log("data: ", data);
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
}

export default Root;
