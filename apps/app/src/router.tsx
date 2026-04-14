import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '@/pages/Home';
import CategoryRoute from '@/pages/Category';
import ItemRoute from '@/pages/Item';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/category/:slug', element: <CategoryRoute /> },
  { path: '/item/:id', element: <ItemRoute /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
