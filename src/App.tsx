import React, { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';

// Layout
import LayOut from './components/LayOut/LayOut';
import Loading from './components/Loading/Loading';
import PageTransitions from './components/Common/PageTransitions';
import ErrorBoundary from './components/Common/ErrorBoundary';

// Context
import { useAuth } from './Context';
import { storage } from './utils/storage';


// Route Guards
import UnProtectedRoutes from './components/DirectingUsers/UnProtectedRoutes';
import ProtectedRoutes from './components/DirectingUsers/protectedRoutes';

import { pages } from './constants/pages';

const Home = lazy(pages.Home);
const Products = lazy(pages.Products);
const Categories = lazy(pages.Categories);
const Wishlist = lazy(pages.Wishlist);
const Cart = lazy(pages.Cart);
const Details = lazy(pages.Details);
const Register = lazy(pages.Register);
const Login = lazy(pages.Login);
const NotFound = lazy(pages.NotFound);
const AllOrders = lazy(pages.AllOrders);
const Checkout = lazy(pages.Checkout);
const ForgotPass = lazy(pages.ForgotPass);
const VerifyResetCode = lazy(pages.VerifyResetCode);
const ResetPassword = lazy(pages.ResetPassword);
const Profile = lazy(pages.Profile);
const SubCategories = lazy(pages.SubCategories);

// Suspense wrapper for lazy components with animations
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<Loading />}>
        <PageTransitions>
            {children}
        </PageTransitions>
    </Suspense>
);

// Define router outside component to prevent recreation on every render
const router = createBrowserRouter([
    {
        path: '/',
        element: <LayOut />,
        children: [
            // Protected Routes (Require Token)
            {
                index: true,
                element: (
                    <SuspenseWrapper>
                        <Home />
                    </SuspenseWrapper>
                ),
            },
            {
                path: '/products',
                element: (
                    <SuspenseWrapper>
                        <Products />
                    </SuspenseWrapper>
                ),
            },
            {
                path: '/cart',
                element: (
                    <ProtectedRoutes>
                        <SuspenseWrapper>
                            <Cart />
                        </SuspenseWrapper>
                    </ProtectedRoutes>
                ),
            },
            {
                path: '/categories',
                element: (
                    <SuspenseWrapper>
                        <Categories />
                    </SuspenseWrapper>
                ),
            },
            {
                path: '/categories/:categoryId',
                element: (
                    <SuspenseWrapper>
                        <SubCategories />
                    </SuspenseWrapper>
                ),
            },
            {
                path: '/wishlist',
                element: (
                    <ProtectedRoutes>
                        <SuspenseWrapper>
                            <Wishlist />
                        </SuspenseWrapper>
                    </ProtectedRoutes>
                ),
            },
            {
                path: '/details/:id',
                element: (
                    <SuspenseWrapper>
                        <Details />
                    </SuspenseWrapper>
                ),
            },
            {
                path: '/allorders',
                element: (
                    <ProtectedRoutes>
                        <SuspenseWrapper>
                            <AllOrders />
                        </SuspenseWrapper>
                    </ProtectedRoutes>
                ),
            },
            {
                path: '/Checkout/:sessionId',
                element: (
                    <ProtectedRoutes>
                        <SuspenseWrapper>
                            <Checkout />
                        </SuspenseWrapper>
                    </ProtectedRoutes>
                ),
            },
            {
                path: '/profile',
                element: (
                    <ProtectedRoutes>
                        <SuspenseWrapper>
                            <Profile />
                        </SuspenseWrapper>
                    </ProtectedRoutes>
                ),
            },

            // Authentication Routes (No Token Required)
            {
                path: '/register',
                element: (
                    <UnProtectedRoutes>
                        <SuspenseWrapper>
                            <Register />
                        </SuspenseWrapper>
                    </UnProtectedRoutes>
                ),
            },
            {
                path: '/login',
                element: (
                    <UnProtectedRoutes>
                        <SuspenseWrapper>
                            <Login />
                        </SuspenseWrapper>
                    </UnProtectedRoutes>
                ),
            },

            // Password Recovery Routes (No Token Required)
            {
                path: '/forgot-password',
                element: (
                    <UnProtectedRoutes>
                        <SuspenseWrapper>
                            <ForgotPass />
                        </SuspenseWrapper>
                    </UnProtectedRoutes>
                ),
            },
            {
                path: '/VerifyResetCode',
                element: (
                    <UnProtectedRoutes>
                        <SuspenseWrapper>
                            <VerifyResetCode />
                        </SuspenseWrapper>
                    </UnProtectedRoutes>
                ),
            },
            {
                path: '/ResetPassword',
                element: (
                    <UnProtectedRoutes>
                        <SuspenseWrapper>
                            <ResetPassword />
                        </SuspenseWrapper>
                    </UnProtectedRoutes>
                ),
            },

            // 404 Page
            {
                path: '*',
                element: (
                    <SuspenseWrapper>
                        <NotFound />
                    </SuspenseWrapper>
                ),
            },
        ],
    },
]);

function App() {
    const { setUserToken } = useAuth();
    const { i18n } = useTranslation();

    // Set document direction and language for accessibility and RTL support
    useEffect(() => {
        const dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    useEffect(() => {
        const token = storage.get<string>('userToken');
        if (token) {
            setUserToken(token);
        }
    }, [setUserToken]);

    return (
        <ErrorBoundary>
            <RouterProvider router={router} />
        </ErrorBoundary>
    );
}

export default App;
