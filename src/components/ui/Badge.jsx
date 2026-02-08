const Badge = ({
    children,
    variant = 'default',
    className = ''
}) => {
    const variants = {
        default: 'bg-white/10 text-white border-white/20',
        verified: 'badge-verified',
        pending: 'badge-pending',
        urgent: 'badge-urgent',
        sold: 'badge-sold',
        concert: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        movie: 'bg-red-500/20 text-red-400 border-red-500/30',
        train: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        bus: 'bg-green-500/20 text-green-400 border-green-500/30',
        sports: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };

    return (
        <span className={`badge ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
