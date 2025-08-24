import Header from "../../components/header/Header.tsx";
import Checkout from "../../components/checkout/checkout.tsx";


const CheckoutPage = () => {
    return (
        <>
            <Header hasSearch={false} hasCart={false}/>
            <Checkout/>
        </>
    );
};

export default CheckoutPage;