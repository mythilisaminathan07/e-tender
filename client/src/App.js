import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import VendorDashboard from './pages/vendor/VendorDashboard';
import PostTender from './pages/admin/PostTender';
import ManageTenders from './pages/admin/ManageTenders';
import ViewBids from './pages/admin/ViewBids';
import BrowseTenders from './pages/vendor/BrowseTenders';
import SubmitBid from './pages/vendor/SubmitBid';
import MyBids from './pages/vendor/MyBids';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/post-tender" element={<PrivateRoute role="admin"><PostTender /></PrivateRoute>} />
        <Route path="/admin/tenders" element={<PrivateRoute role="admin"><ManageTenders /></PrivateRoute>} />
        <Route path="/admin/bids" element={<PrivateRoute role="admin"><ViewBids /></PrivateRoute>} />
        <Route path="/vendor/dashboard" element={<PrivateRoute role="vendor"><VendorDashboard /></PrivateRoute>} />
        <Route path="/vendor/tenders" element={<PrivateRoute role="vendor"><BrowseTenders /></PrivateRoute>} />
        <Route path="/vendor/submit-bid/:tenderId" element={<PrivateRoute role="vendor"><SubmitBid /></PrivateRoute>} />
        <Route path="/vendor/my-bids" element={<PrivateRoute role="vendor"><MyBids /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;