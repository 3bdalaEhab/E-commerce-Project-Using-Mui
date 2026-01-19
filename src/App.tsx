import React, { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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

// Lazy loaded pages with prefetch support
export const pages = {
    Home: () => import('./pages/Home/Home'),
    Products: () => import('./pages/Products/Products'),
    Categories: () => import('./pages/Categories/Categories'),
    Wishlist: () => import('./pages/Wishlist/Wishlist'),
    Cart: () => import('./pages/Cart/Cart'),
    Details: () => import('./pages/Details/Details'),
    Register: () => import('./pages/Register/Register'),
    Login: () => import('./pages/Login/Login'),
    NotFound: () => import('./pages/NotFound/NotFound'),
    AllOrders: () => import('./pages/AllOrders/AllOrders'),
    Checkout: () => import('./pages/Checkout/Checkout'),
    ForgotPass: () => import('./pages/ForgotPass/ForgotPass'),
    VerifyResetCode: () => import('./pages/VerifyResetCode/VerifyResetCode'),
    ResetPassword: () => import('./pages/ResetPassword/ResetPassword'),
    ChangePassword: () => import('./pages/ChangePassword/ChangePassword'),
    Profile: () => import('./pages/Profile/Profile'),
};

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
const ChangePassword = lazy(pages.ChangePassword);
const Profile = lazy(pages.Profile);

// Suspense wrapper for lazy components with animations
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<Loading />}>
        <PageTransitions>
            {children}
        </PageTransitions>
    </Suspense>
);

function App() {
    const { setUserToken } = useAuth();

    useEffect(() => {
        const token = storage.get<string>('userToken');
        if (token) {
            setUserToken(token);
        }
    }, [setUserToken]);

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
                    path: '/change-password',
                    element: (
                        <ProtectedRoutes>
                            <SuspenseWrapper>
                                <ChangePassword />
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

    return (
        <ErrorBoundary>
            <RouterProvider router={router} />
        </ErrorBoundary>
    );
}

export default App;
