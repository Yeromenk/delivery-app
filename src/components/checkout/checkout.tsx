import './checkout.css'
import useCart from "../../hooks/use-cart.ts";
import CheckoutSidebar from "../checkout-sidebar/checkout-sidebar.tsx";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CheckoutCart from "../../checkout/checkout-cart.tsx";
import CheckoutPersonalInfo from "../../checkout/checkout-personal-info.tsx";
import CheckoutAddressForm from "../../checkout/checkout-address-form.tsx";
import { checkoutFormSchema, type CheckoutFormValues } from "../../checkout/checkout-form-schema.tsx";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const Checkout = () => {
    const { totalAmount, items, removeCartItem, updateItemQuantity, loading } = useCart();
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

    useEffect(() => {
        let mounted = true;
        const prefillFromMe = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
                if (!mounted || !data?.user) return;

                const current = form.getValues();
                const full = String(data.user.fullName || '').trim();
                const [first, ...rest] = full.split(/\s+/);
                const last = rest.join(' ');

                if (!current.email && data.user.email) {
                    form.setValue('email', data.user.email);
                }

                if (!current.firstName && first) {
                    form.setValue('firstName', first);
                }

                if (!current.lastName && last) {
                    form.setValue('lastName', last);
                }

                if (!current.phone && data.user.phone) {
                    form.setValue('phone', data.user.phone);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    return;
                }
                console.log("[USER_DATA_ERROR], ", error);
                toast.error("Error loading user data");
            }
        };

        prefillFromMe();

        const onAuth = () => prefillFromMe();
        window.addEventListener('auth:success', onAuth as EventListener);
        return () => {
            mounted = false;
            window.removeEventListener('auth:success', onAuth as EventListener);
        };
    }, [])

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

                                <CheckoutPersonalInfo />

                                <CheckoutAddressForm />
                            </div>

                            <CheckoutSidebar totalAmount={totalAmount} loading={loading || submitting} />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};

export default Checkout;