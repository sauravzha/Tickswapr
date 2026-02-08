import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Ticket, User, LogOut, LayoutDashboard, PlusCircle, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const navLinks = [
        { name: 'Browse', href: '/browse' },
        { name: 'Urgent Requests', href: '/urgent' },
        { name: 'How It Works', href: '/#how-it-works' },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setShowUserMenu(false);
    };

    const isActive = (href) => location.pathname === href;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'glass shadow-lg shadow-black/10'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-lg shadow-neon-purple/30">
                                <Ticket className="w-5 h-5 text-white" />
                            </div>
                            <motion.div
                                className="absolute inset-0 rounded-xl bg-neon-purple/50 blur-xl"
                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                        <span className="text-xl font-bold">
                            <span className="gradient-text">Tick</span>
                            <span className="text-white">Swapr</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.href}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`relative px-4 py-2 rounded-xl transition-colors ${isActive(link.href)
                                        ? 'text-white'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                    {isActive(link.href) && (
                                        <motion.div
                                            layoutId="navIndicator"
                                            className="absolute inset-0 bg-white/10 rounded-xl -z-10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <>
                                {/* Notification Bell */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <Bell className="w-5 h-5 text-gray-400" />
                                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
                                </motion.button>

                                {/* Sell Button */}
                                <Link to="/sell">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button variant="secondary" size="sm" className="gap-2">
                                            <PlusCircle className="w-4 h-4" />
                                            Sell
                                        </Button>
                                    </motion.div>
                                </Link>

                                {/* User Menu */}
                                <div className="relative">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center ring-2 ring-white/20">
                                            <span className="text-sm font-semibold">
                                                {(user.name || user.displayName || 'U').charAt(0)}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium max-w-[100px] truncate">
                                            {user.name || user.displayName || 'User'}
                                        </span>
                                        <motion.div
                                            animate={{ rotate: showUserMenu ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        </motion.div>
                                    </motion.button>

                                    {/* Dropdown */}
                                    <AnimatePresence>
                                        {showUserMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 top-full mt-2 w-56 glass-card p-2 shadow-xl"
                                            >
                                                <div className="px-3 py-2 mb-2 border-b border-white/10">
                                                    <div className="font-medium truncate">{user.displayName}</div>
                                                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                                </div>
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                                                >
                                                    <LayoutDashboard className="w-4 h-4 text-gray-400 group-hover:text-neon-purple transition-colors" />
                                                    <span>Dashboard</span>
                                                </Link>
                                                <Link
                                                    to="/my-tickets"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                                                >
                                                    <Ticket className="w-4 h-4 text-gray-400 group-hover:text-neon-cyan transition-colors" />
                                                    <span>My Tickets</span>
                                                </Link>
                                                {isAdmin && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setShowUserMenu(false)}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                                                    >
                                                        <LayoutDashboard className="w-4 h-4 text-neon-purple" />
                                                        <span className="gradient-text font-medium">Admin Panel</span>
                                                    </Link>
                                                )}
                                                <hr className="my-2 border-white/10" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors w-full text-left group"
                                                >
                                                    <LogOut className="w-4 h-4 text-red-400" />
                                                    <span className="text-red-400">Logout</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button variant="ghost" size="sm">Login</Button>
                                    </motion.div>
                                </Link>
                                <Link to="/login?signup=true">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button size="sm" className="btn-glow">Get Started</Button>
                                    </motion.div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                >
                                    <X className="w-6 h-6" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                >
                                    <Menu className="w-6 h-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden glass border-t border-white/10 overflow-hidden"
                    >
                        <div className="px-4 py-6 space-y-2">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        to={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-3 rounded-xl transition-colors ${isActive(link.href)
                                            ? 'bg-white/10 text-white'
                                            : 'text-gray-300 hover:bg-white/5'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <hr className="border-white/10 my-4" />

                            {user ? (
                                <>
                                    <Link
                                        to="/sell"
                                        onClick={() => setIsOpen(false)}
                                        className="block"
                                    >
                                        <Button className="w-full justify-center gap-2">
                                            <PlusCircle className="w-4 h-4" />
                                            Sell Your Ticket
                                        </Button>
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="block w-full text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-3">
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="secondary" className="w-full">Login</Button>
                                    </Link>
                                    <Link to="/login?signup=true" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full">Get Started</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
