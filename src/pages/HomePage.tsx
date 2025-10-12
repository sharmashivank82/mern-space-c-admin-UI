import Title from "antd/es/typography/Title";
import { useAuthStore } from "../store";

function HomePage() {
  const { user } = useAuthStore();

  return (
    <div>
      <Title level={4}>Welcome, {user?.firstName}</Title>
    </div>
  );
}

export default HomePage;
