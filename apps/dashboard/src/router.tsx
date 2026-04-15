import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import { getToken } from "./lib/auth";
import Categories from "./pages/Categories";
import Items from "./pages/Items";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={getToken() ? "/items" : "/login"} replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/items", element: <Items /> },
          { path: "/categories", element: <Categories /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
