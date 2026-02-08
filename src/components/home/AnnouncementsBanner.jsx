import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Users, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';

// Mock recent announcements
const recentAnnouncements = [
    {
        id: 1,
        type: 'new_feature',
        title: 'AI Verification Now Live!',
        description: 'All tickets are now scanned by our AI for instant fraud detection.',
        icon: '🤖',
        time: '2 hours ago'
    },
    {
        id: 2,
        type: 'promo',
        title: 'Zero Platform Fee This Weekend!',
        description: 'List your tickets with 0% commission until Sunday midnight.',
        icon: '🎉',
        time: '5 hours ago'
    },
    {
        id: 3,
        type: 'trending',
        title: 'Coldplay Tickets in High Demand',
        description: '500+ buyers looking for Mumbai concert tickets. Sell yours now!',
        icon: '🔥',
        time: '1 day ago'
    }
];

// Community stats
const communityStats = [
    { label: 'Active Sellers', value: '2,450+', icon: Users },
    { label: 'Avg. Sell Time', value: '< 4 hrs', icon: Clock },
    { label: 'This Month', value: '₹45L+', icon: TrendingUp }
];

const AnnouncementsBanner = () => {
    return (
        <section className="py-16 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-transparent to-neon-cyan/10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Announcements Column */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 mb-6"
                        >
                            <MessageSquare className="w-5 h-5 text-neon-cyan" />
                            <h3 className="text-xl font-semibold">Latest Updates</h3>
                        </motion.div>

                        <div className="space-y-4">
                            {recentAnnouncements.map((announcement, index) => (
                                <motion.div
                                    key={announcement.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card hover={true} className="p-5">
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl">{announcement.icon}</div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-semibold">{announcement.title}</h4>
                                                    <span className="text-xs text-gray-500">{announcement.time}</span>
                                                </div>
                                                <p className="text-sm text-gray-400">{announcement.description}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Community Stats Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-6 h-full">
                            <h3 className="text-lg font-semibold mb-6">Community Stats</h3>

                            <div className="space-y-6 mb-8">
                                {communityStats.map((stat, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
                                                <stat.icon className="w-5 h-5 text-neon-purple" />
                                            </div>
                                            <span className="text-gray-400">{stat.label}</span>
                                        </div>
                                        <span className="font-bold gradient-text">{stat.value}</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-white/10 mb-6" />

                            <div className="text-center">
                                <p className="text-sm text-gray-400 mb-4">
                                    Join thousands of happy buyers & sellers
                                </p>
                                <Link to="/login">
                                    <Button className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                                        Join the Community
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AnnouncementsBanner;
