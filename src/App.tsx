import Header from './components/header/Header.tsx'
import { createBrowserRouter, Outlet, RouterProvider, useLocation, useNavigationType } from 'react-router-dom'
import Main from "./pages/main/Main.tsx"
import NotFound from "./components/not-found-page/NotFound.tsx"
import ErrorBoundary from "./components/error-boundary/ErrorBoundary.tsx";
import ProductPage from './pages/product/ProductPage.tsx';
import CheckoutPage from "./pages/checkout/checkout-page.tsx";
import Success from "./components/success/success.tsx";
import Cancel from "./components/cancel/cancel.tsx";
import ProfilePage from './pages/profile/profile.tsx';
import { useEffect } from 'react';
import NProgress from 'nprogress';

const App = () => {
    return (
        <RouterProvider router={router} />
    )
}

const Layout = () => {
    const location = useLocation();
    const navType = useNavigationType();
    const isCheckout = location.pathname.startsWith('/checkout');

    useEffect(() => {
        NProgress.start();
        const id = requestAnimationFrame(() => NProgress.done());
        return () => cancelAnimationFrame(id);
    }, [location.key, navType]);

    return (
        <>
            <Header hasSearch={!isCheckout} hasCart={!isCheckout} />
            <Outlet />
        </>
    )
}

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: (
            <ErrorBoundary>
                <Layout />
            </ErrorBoundary>
        ),
        children: [
            {
                index: true,
                element: <Main />,
                errorElement: (
                    <ErrorBoundary>
                        <Main />
                    </ErrorBoundary>
                ),
            },
            {
                path: 'products/:id',
                element: <ProductPage />,
                errorElement: (
                    <ErrorBoundary>
                        <ProductPage />
                    </ErrorBoundary>
                ),
            },
            {
                path: 'checkout',
                element: <CheckoutPage />,
                errorElement: (
                    <ErrorBoundary>
                        <CheckoutPage />
                    </ErrorBoundary>
                ),
            },
            {
                path: 'success',
                element: <Success />,
            },
            {
                path: 'cancel',
                element: <Cancel />,
            },
            {
                path: 'profile',
                element: <ProfilePage />,
            },
        ],
    },
    {
        path: '*',
        element: (
            <>
                <Header />
                <NotFound />
            </>
        ),
    },
]);


export default App