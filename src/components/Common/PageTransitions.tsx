import React from 'react';
import { motion, Variants } from 'framer-motion';

interface PageTransitionsProps {
    children: React.ReactNode;
}

const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4, // Reduced from 0.6
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: 0.08 // Faster stagger
        }
    },
    exit: {
        opacity: 0,
        y: -10, // Subtle lift
        transition: {
            duration: 0.3, // Reduced from 0.4
            ease: "easeInOut"
        }
    }
};

const PageTransitions: React.FC<PageTransitionsProps> = ({ children }) => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ width: '100%' }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransitions;
