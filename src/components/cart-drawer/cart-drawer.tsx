import React, {useState, type MouseEvent, type ReactElement, useEffect, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight, X} from 'lucide-react';
import './cart-drawer.css';
import CartDrawerItem from '../cart-drawer-item/cart-drawer-item.tsx';
import {getCartItemsDetails} from '../../lib/get-cart-items-details.ts';
import {type PizzaSize, type PizzaType} from '../../assets/constants/pizza.ts';
import {useCartStore} from "../../store/cart.ts";

type TriggerProps = {
    onClick?: (e: MouseEvent) => void;
};

interface Props {
    children: ReactElement<TriggerProps>;
}

const CartDrawer: React.FC<Props> = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = useCallback(() => setIsOpen((v) => !v), []);

    const trigger = React.cloneElement(children, {
        onClick: (e: MouseEvent) => {
            toggleDrawer();
            children.props.onClick?.(e);
        },
    });

    const {totalAmount, items: cartItems, fetchCartItems, loading, updateItemQuantity, removeCartItem} = useCartStore();

    useEffect(() => {
        fetchCartItems();
    }, []); // Убрал fetchCartItems из зависимостей

    // Функция для безопасного приведения типов
    const getPizzaTypeAndSize = useCallback((item: typeof cartItems[0]) => {
        const pizzaType = item.pizzaType;
        const pizzaSize = item.pizzaSize;

        if (pizzaType && pizzaSize &&
            (pizzaType === 1 || pizzaType === 2)) {
            return {
                type: pizzaType as PizzaType,
                size: pizzaSize as PizzaSize
            };
        }
        return null;
    }, []);

    if (loading && cartItems.length === 0) {
        return null; // Или показать loader
    }

    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
       const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;

       updateItemQuantity(id, newQuantity)
    }

    return (
        <>
            {trigger}
            {isOpen && <div className="cart-drawer-overlay" onClick={toggleDrawer}/>}
            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
                <div className="cart-drawer-header">
                    <h2 className="cart-drawer-title">
                        In cart <span className="font-bold">{cartItems.length} items</span>
                    </h2>
                    <button onClick={toggleDrawer} className="cart-drawer-close">
                        <X size={24}/>
                    </button>
                </div>

                <div className="cart-drawer-body">
                    {cartItems.map((item) => {
                        const pizzaInfo = getPizzaTypeAndSize(item);

                        return (
                            <CartDrawerItem
                                key={item.id}
                                id={item.id}
                                imageUrl={item.imageUrl}
                                details={
                                    pizzaInfo
                                        ? getCartItemsDetails(
                                            pizzaInfo.type,
                                            pizzaInfo.size,
                                            item.ingredients || []
                                        )
                                        : ''
                                }
                                name={item.name}
                                price={item.price}
                                quantity={item.quantity}
                                onClickUpdateQuantity={(type) => onClickCountButton(item.id, item.quantity, type)}
                                onClickRemove={() => removeCartItem(item.id)}
                            />
                        );
                    })}
                </div>

                <div className="cart-drawer-footer">
                    <div className="cart-total">
                        <span className="cart-total-label">Total</span>
                        <div className="cart-total-divider"/>
                        <span className="cart-total-amount">{totalAmount} CZK</span>
                    </div>
                    <Link to="/checkout" className="checkout-link">
                        <button className="checkout-button" onClick={() => setIsOpen(false)}>
                            Checkout
                            <ArrowRight className="w-5 ml-2"/>
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;