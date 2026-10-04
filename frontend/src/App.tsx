import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AdminPage } from './pages/AdminPage';
import { DemoOrderPage } from './pages/DemoOrderPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProductPage } from './pages/ProductPage';
import { RestaurantPage } from './pages/RestaurantPage';
import { SearchPage } from './pages/SearchPage';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="busca" element={<SearchPage />} />
        <Route path="produto/:id" element={<ProductPage />} />
        <Route path="restaurante/:id" element={<RestaurantPage />} />
        <Route path="pedido-simulado" element={<DemoOrderPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
