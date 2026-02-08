import { Link } from 'react-router-dom';
import { Ticket, Mail, MapPin, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        platform: [
            { name: 'Browse Tickets', href: '/browse' },
            { name: 'Sell Tickets', href: '/sell' },
            { name: 'Urgent Requests', href: '/urgent' },
            { name: 'How It Works', href: '/#how-it-works' },
        ],
        categories: [
            { name: 'Concert Tickets', href: '/browse?category=concert' },
            { name: 'Movie Tickets', href: '/browse?category=movie' },
            { name: 'Train Tickets', href: '/browse?category=train' },
            { name: 'Bus Tickets', href: '/browse?category=bus' },
            { name: 'Sports Events', href: '/browse?category=sports' },
        ],
        support: [
            { name: 'Help Center', href: '/help' },
            { name: 'Safety Tips', href: '/safety' },
            { name: 'Report an Issue', href: '/report' },
            { name: 'Contact Us', href: '/contact' },
        ],
        legal: [
            { name: 'Terms of Service', href: '/terms' },
            { name: 'Privacy Policy', href: '/privacy' },
            { name: 'Refund Policy', href: '/refunds' },
            { name: 'Seller Agreement', href: '/seller-agreement' },
        ],
    };

    const socialLinks = [
        { icon: Twitter, href: 'https://twitter.com' },
        { icon: Instagram, href: 'https://instagram.com' },
        { icon: Linkedin, href: 'https://linkedin.com' },
        { icon: Youtube, href: 'https://youtube.com' },
    ];

    return (
        <footer className="bg-dark-800 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
                                <Ticket className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text">TickSwapr</span>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-xs">
                            Your trusted Gen-Z ticket resale marketplace. Buy & sell tickets safely with verified sellers.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-2 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-neon-purple" />
                                <span>support@tickswapr.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-neon-purple" />
                                <span>Mumbai, India</span>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2">
                            {footerLinks.platform.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Categories</h4>
                        <ul className="space-y-2">
                            {footerLinks.categories.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-gray-500 text-sm">
                            © {currentYear} TickSwapr. All rights reserved.
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                            Created with ❤️ by <span className="text-neon-purple font-medium">Saurav Jha</span>
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-neon-purple/20 transition-colors"
                            >
                                <social.icon className="w-5 h-5 text-gray-400 hover:text-neon-purple" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <span className="text-emerald-400">✓</span>
                        </div>
                        <span>Verified Tickets</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <span className="text-blue-400">🔒</span>
                        </div>
                        <span>Secure Payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <span className="text-purple-400">💰</span>
                        </div>
                        <span>Money-back Guarantee</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
