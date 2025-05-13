// components/animated-routes.tsx
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy } from 'react';

const HomePage = lazy(() => import('../../pages/home'));
const AboutPage = lazy(() => import('../../pages/about'));

const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
                <Route
                    path='/'
                    element={
                        <motion.div
                            variants={fadeVariants}
                            initial='initial'
                            animate='animate'
                            exit='exit'
                            transition={{ duration: 0.4 }}
                        >
                            <HomePage />
                        </motion.div>
                    }
                />
                <Route
                    path='/about'
                    element={
                        <motion.div
                            variants={fadeVariants}
                            initial='initial'
                            animate='animate'
                            exit='exit'
                            transition={{ duration: 0.4 }}
                        >
                            <AboutPage />
                        </motion.div>
                    }
                />
                <Route
                    path='*'
                    element={
                        <div>
                            Page not found. Go to <Link to='/'>Homepage</Link>
                        </div>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
