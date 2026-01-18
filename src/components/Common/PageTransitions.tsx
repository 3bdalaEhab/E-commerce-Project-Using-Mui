import React from "react";
import { motion } from "framer-motion";

interface PageTransitionsProps {
    children: React.ReactNode;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 10,
        filter: "blur(4px)",
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as any, // Custom cubic-bezier for premium feel
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        filter: "blur(4px)",
        transition: {
            duration: 0.4,
        },
    },
};

const PageTransitions: React.FC<PageTransitionsProps> = ({ children }) => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {children}
        </motion.div>
    );
};

export default PageTransitions;
