import Header from './components/header/Header.tsx'
import {createBrowserRouter, Outlet, RouterProvider} from 'react-router-dom'
import Main from "./pages/main/Main.tsx"
import NotFound from "./components/not-found-page/NotFound.tsx"
import ErrorBoundary from "./components/error-boundary/ErrorBoundary.tsx";
import ProductInfo from "./components/product-info/ProductInfo.tsx";
import {useParams} from 'react-router-dom';
import CheckoutPage from "./pages/checkout/checkout-page.tsx";
import Success from "./components/success/success.tsx";
import Cancel from "./components/cancel/cancel.tsx";

const App = () => {
    return (
        <RouterProvider router={router}/>
    )
}

const Layout = () => {
    return (
        <>
            <Header/>
            <Outlet/>
        </>
    )
}

const ProductPage = () => {
    const {id} = useParams<{ id: string }>();

    if (!id) {
        return <NotFound/>;
    }

    return <ProductInfo params={{id}}/>;
};

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