import React from 'react';
import { motion, Variants } from 'framer-motion';

interface PageTransitionsProps {
    children: React.ReactNode;
}

const pageVariants: Variants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.1,
            ease: "linear",
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.05,
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
