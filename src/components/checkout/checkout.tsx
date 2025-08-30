import './checkout.css'
import useCart from "../../hooks/use-cart.ts";
import CheckoutSidebar from "../checkout-sidebar/checkout-sidebar.tsx";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import CheckoutCart from "../../checkout/checkout-cart.tsx";
import CheckoutPersonalInfo from "../../checkout/checkout-personal-info.tsx";
import CheckoutAddressForm from "../../checkout/checkout-address-form.tsx";
import {checkoutFormSchema, type CheckoutFormValues} from "../../checkout/checkout-form-schema.tsx";
import toast from "react-hot-toast";
import {useCallback, useState} from "react";
import axios from "axios";

const Checkout = () => {
    const {totalAmount, items, removeCartItem, updateItemQuantity, loading} = useCart();
    const [submitting, setSubmitting] = useState(false);

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

    const onSubmit = useCallback(
        async (data: CheckoutFormValues) => {
            if (items.length === 0 || totalAmount === 0) {
                toast.error('Cart is empty');
                return;
            }

            const cartToken = localStorage.getItem('cartToken');
            setSubmitting(true);
            try {
                const response = await axios.post(
                    'http://localhost:5000/api/orders',
                    {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phone,
                        email: data.email,
                        address: data.address,
                        comment: data.comment || '',
                    },
                    {
                        headers: {
                            ...(cartToken ? { 'x-cart-token': cartToken } : {}),
                        },
                        withCredentials: true,
                    },
                );

                toast.success(
                    `Order created. Status: ${response.data.order.status}. Redirecting to payment...`,
                );

                window.location.href = response.data.checkoutUrl;
            } catch (error) {
                const message = axios.isAxiosError(error)
                    ? error.response?.data?.message || error.message
                    : 'Error creating order';
                toast.error("Error creating order: " + message);
            } finally {
                setSubmitting(false);
            }
        },
        [items, totalAmount],
    );

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

                            <CheckoutSidebar totalAmount={totalAmount} loading={loading || submitting}/>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default Checkout;