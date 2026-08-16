import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import { ThemeProvider } from './context/ThemeContext';
import './styles/App.css';

// Auth pages
import Login from './pages/auth/Login/Login';
import Register from './pages/auth/Register/Register';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard/Dashboard';
import AdminProducts from './pages/admin/Products/Products';
import AdminCategories from './pages/admin/Categories/Categories';

// Customer pages
import Shop from './pages/customer/Shop/Shop';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Layout role="Admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            {/* add more admin routes later */}
          </Route>

          {/* Customer Routes */}
          <Route path="/" element={<Layout role="Customer" />}>
            <Route index element={<Shop />} />
            {/* add more customer routes later */}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
