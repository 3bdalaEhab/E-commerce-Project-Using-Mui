import { lazy, Suspense, useContext, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './App.css';

// Layout
import LayOut from './components/LayOut/LayOut';
import Loading from './components/Loading/Loading';
import PageTransitions from './components/Common/PageTransitions';

// Context
import { tokenContext } from './Context/tokenContext';

// Route Guards
import UnProtectedRoutes from './components/DirectingUsers/UnProtectedRoutes';
import ProtectedRoutes from './components/DirectingUsers/protectedRoutes';

// Lazy loaded pages for better performance
const Home = lazy(() => import('./pages/Home/Home'));
const Products = lazy(() => import('./pages/Products/Products'));
const Categories = lazy(() => import('./pages/Categories/Categories'));
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const Details = lazy(() => import('./pages/Details/Details'));
const Register = lazy(() => import('./pages/Register/Register'));
const Login = lazy(() => import('./pages/Login/Login'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const AllOrders = lazy(() => import('./pages/AllOrders/AllOrders'));
const Checkout = lazy(() => import('./pages/Checkout/Checkout'));
const ForgotPass = lazy(() => import('./pages/ForgotPass/ForgotPass'));
const VerifyResetCode = lazy(() => import('./pages/VerifyResetCode/VerifyResetCode'));
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPassword'));
const ChangePassword = lazy(() => import('./pages/ChangePassword/ChangePassword'));
const Profile = lazy(() => import('./pages/Profile/Profile'));

// Suspense wrapper for lazy components with animations
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<Loading />}>
        <PageTransitions>
            {children}
        </PageTransitions>
    </Suspense>
);

function App() {
    const { setUserToken } = useContext(tokenContext);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
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

    return <RouterProvider router={router} />;
}

export default App;
