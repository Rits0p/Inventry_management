import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import './styles/App.css';

// Auth pages
import Login from './pages/auth/Login/Login';
import Register from './pages/auth/Register/Register';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard/Dashboard';
import AdminProducts from './pages/admin/Products/Products';
import AdminCategories from './pages/admin/Categories/Categories';
import AdminOrders from './pages/admin/Orders/Orders';
import AdminStock from './pages/admin/Stock/Stock';

// Customer pages
import Home from './pages/customer/Home/Home';
import Shop from './pages/customer/Shop/Shop';
import Categories from './pages/customer/Categories/Categories';
import CategoryDetail from './pages/customer/CategoryDetail/CategoryDetail';
import FlashDeals from './pages/customer/FlashDeals/FlashDeals';
import TopSelling from './pages/customer/TopSelling/TopSelling';
import NewArrivals from './pages/customer/NewArrivals/NewArrivals';
import CustomerDashboard from './pages/customer/Dashboard/Dashboard';
import Cart from './pages/customer/Cart/Cart';
import CustomerOrders from './pages/customer/Orders/Orders';
import ProductDetail from './pages/customer/ProductDetail/ProductDetail';
import Profile from './pages/customer/Profile/Profile';

// Error pages
import NotFound from './pages/errors/NotFound';
import Unauthorized from './pages/errors/Unauthorized';
import ServerError from './pages/errors/ServerError';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Error pages */}
              <Route path="/403" element={<Unauthorized />} />
              <Route path="/500" element={<ServerError />} />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="Admin">
                    <Layout role="Admin" />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="stock" element={<AdminStock />} />
              </Route>

              {/* Customer Routes – public browsing */}
              <Route path="/" element={<Layout role="Customer" />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="flash-deals" element={<FlashDeals />} />
                <Route path="top-selling" element={<TopSelling />} />
                <Route path="new-arrivals" element={<NewArrivals />} />
                <Route path="categories" element={<Categories />} />
                <Route path="categories/:slug" element={<CategoryDetail />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute role="Customer">
                      <CustomerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="cart"
                  element={
                    <ProtectedRoute role="Customer">
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <ProtectedRoute role="Customer">
                      <CustomerOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute role="Customer">
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* 404 – catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
