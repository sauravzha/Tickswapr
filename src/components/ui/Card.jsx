import { motion } from 'framer-motion';

const Card = ({
    children,
    className = '',
    hover = true,
    onClick,
    ...props
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { y: -4 } : {}}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className={`glass-card p-6 ${onClick ? 'cursor-pointer' : ''} ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
