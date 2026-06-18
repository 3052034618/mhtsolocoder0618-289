import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/home';
import SearchPage from '@/pages/search';
import ListingDetail from '@/pages/listing/[id]';
import NewListing from '@/pages/listing/NewListing';
import MyListings from '@/pages/listing/MyListings';
import Login from '@/pages/user/Login';
import Register from '@/pages/user/Register';
import Profile from '@/pages/user/Profile';
import Bookings from '@/pages/booking/Bookings';
import Messages from '@/pages/message/Messages';
import Forum from '@/pages/forum/Forum';
import Points from '@/pages/points/Points';
import Admin from '@/pages/admin/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  if (isAuthRoute) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/my-listings/new" element={<NewListing />} />
          <Route path="/my-listings/:id/edit" element={<NewListing />} />
          <Route path="/my-listings/:id/calendar" element={<NewListing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<Profile />} />
          <Route path="/profile/verify" element={<Profile />} />
          <Route path="/profile/credit" element={<Profile />} />
          <Route path="/profile/settings" element={<Profile />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookings/:id" element={<Bookings />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<Messages />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/new" element={<Forum />} />
          <Route path="/forum/:id" element={<Forum />} />
          <Route path="/points" element={<Points />} />
          <Route path="/favorites" element={<Profile />} />
          <Route path="/my-posts" element={<Profile />} />
          <Route path="/reviews" element={<Profile />} />
          <Route path="/reviews/:bookingId" element={<Profile />} />
          <Route path="/user/:id" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/users" element={<Admin />} />
          <Route path="/admin/listings" element={<Admin />} />
          <Route path="/admin/disputes" element={<Admin />} />
        </Routes>
      </Layout>
    </Router>
  );
}
