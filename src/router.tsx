import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Category from "./pages/Category";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/category",
    element: <Category />,
  },
]);
