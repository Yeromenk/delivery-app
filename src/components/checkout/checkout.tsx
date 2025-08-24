import './checkout.css'
import useCart from "../../hooks/use-cart.ts";
import CheckoutSidebar from "../checkout-sidebar/checkout-sidebar.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import CheckoutCart from "../../checkout/checkout-cart.tsx";
import CheckoutPersonalInfo from "../../checkout/checkout-personal-info.tsx";
import CheckoutAddressForm from "../../checkout/checkout-address-form.tsx";
import {checkoutFormSchema, type CheckoutFormValues} from "../../checkout/checkout-form-schema.tsx";

const Checkout = () => {
    const {totalAmount, items, removeCartItem, updateItemQuantity, loading} = useCart();

    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity);
    };

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            comment: '',
        }
    })

    const onSubmit = (data: CheckoutFormValues) => {
        console.log(data);
    }

    return (
        <div className="checkout">
            <h1>Checkout</h1>

            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="checkout-container">
                        <div className="checkout-main">
                            <div className="checkout-left">
                                <CheckoutCart
                                    onClickCountButton={onClickCountButton}
                                    removeCartItem={removeCartItem}
                                    items={items}
                                    loading={loading}
                                />

                                <CheckoutPersonalInfo/>

                                <CheckoutAddressForm/>
                            </div>

                            <CheckoutSidebar totalAmount={totalAmount} loading={loading}/>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default Checkout;