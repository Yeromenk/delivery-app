import React, { useState, type MouseEvent, type ReactElement, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import './cart-drawer.css';
import CartDrawerItem from '../cart-drawer-item/cart-drawer-item.tsx';
import { getCartItemsDetails } from '../../lib/get-cart-items-details.ts';
import { type PizzaSize, type PizzaType } from '../../assets/constants/pizza.ts';
import useCart from "../../hooks/use-cart.ts";
import { Skeleton } from 'primereact/skeleton';

type TriggerProps = {
    onClick?: (e: MouseEvent) => void;
};

interface Props {
    children: ReactElement<TriggerProps>;
}

const CartDrawer: React.FC<Props> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

    const toggleDrawer = useCallback(() => setIsOpen((v) => !v), []);

    const trigger = React.cloneElement(children, {
        onClick: (e: MouseEvent) => {
            toggleDrawer();
            children.props.onClick?.(e);
        },
    });

    const { totalAmount, items, removeCartItem, updateItemQuantity, loading } = useCart();

    const onClickCountButton = async (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        try {
            setUpdatingIds((prev) => new Set(prev).add(id));
            await updateItemQuantity(id, newQuantity);
        } finally {
            setUpdatingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    const isBusy = loading || updatingIds.size > 0;

    return (
        <>
            {trigger}
            {isOpen && <div className="cart-drawer-overlay" onClick={toggleDrawer} />}
            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
                <div className="cart-drawer-header">
                    <h2 className="cart-drawer-title">
                        In cart <span className="font-bold">{items.length} items</span>
                    </h2>
                    <button onClick={toggleDrawer} className="cart-drawer-close">
                        <X size={24} />
                    </button>
                </div>

                <div className={`cart-drawer-content ${!totalAmount ? 'empty-state' : ''}`}>
                    {loading && items.length === 0 ? (
                        <div className="cart-drawer-body">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                                    <Skeleton width="400px" height="60px" borderRadius="8px" />
                                </div>
                            ))}
                        </div>
                    ) : !totalAmount ? (
                        <div className="cart-drawer-empty">
                            <img
                                src="../../../public/images/empty-box.png"
                                width={120}
                                height={120}
                                alt="Empty cart"
                                className="empty-cart-image"
                            />
                            <h3 className="empty-cart-title">Your cart is empty</h3>
                            <p className="empty-cart-text">Add at least one pizza to make a purchase</p>
                            <button className="continue-shopping-btn" onClick={toggleDrawer}>
                                <ArrowLeft className="w-5 mr-2" />
                                Continue shopping
                            </button>
                        </div>
                    ) : (
                        <div className="cart-drawer-body">
                            {items.map((item) => (
                                <div className="cart-drawer-body-item" key={item.id}>
                                    <CartDrawerItem
                                        id={item.id}
                                        imageUrl={item.imageUrl}
                                        details={
                                            item.pizzaSize && item.pizzaType ?
                                                getCartItemsDetails(
                                                    item.ingredients,
                                                    item.pizzaType as PizzaType,
                                                    item.pizzaSize as PizzaSize,
                                                ) : ''
                                        }
                                        name={item.name}
                                        disabled={item.disabled}
                                        price={item.price}
                                        quantity={item.quantity}
                                        updating={updatingIds.has(item.id)}
                                        onClickUpdateQuantity={(type) => onClickCountButton(item.id, item.quantity, type)}
                                        onClickRemove={() => removeCartItem(item.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-drawer-footer">
                        <div className="cart-total">
                            <span className="cart-total-label">Total</span>
                            <div className="cart-total-divider" />
                            {isBusy ? (
                                <span className="cart-total-skeleton" aria-hidden="true" />
                            ) : (
                                <span className="cart-total-amount">{totalAmount} CZK</span>
                            )}
                        </div>
                        <Link to="/checkout" className="checkout-link">
                            <button
                                className={`checkout-button ${(redirect || loading) ? 'loading' : ''}`}
                                onClick={() => {
                                    setRedirect(true);
                                    setIsOpen(false);
                                }}
                                disabled={redirect || loading}
                                aria-busy={redirect || loading}
                            >
                                <span>Checkout</span>
                                {redirect || loading ? (
                                    <span className="checkout-spinner" aria-hidden="true" />
                                ) : (
                                    <ArrowRight className="w-5 ml-2" />
                                )}
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;