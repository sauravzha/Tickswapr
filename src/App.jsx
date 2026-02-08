import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Login from './pages/Login';
import Sell from './pages/Sell';
import TicketDetail from './pages/TicketDetail';
import UrgentRequests from './pages/UrgentRequests';
import MyTickets from './pages/MyTickets';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SellerChat from './pages/SellerChat';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';

function App() {
    return (
        <div className="min-h-screen bg-dark-900 text-white">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/ticket/:id" element={<TicketDetail />} />
                <Route path="/chat/:ticketId" element={<SellerChat />} />
                <Route path="/urgent" element={<UrgentRequests />} />
                <Route path="/my-tickets" element={<MyTickets />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/refund" element={<Refund />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;


