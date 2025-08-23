import './cart-button.css';
import {ShoppingCart, ArrowRight} from 'lucide-react';
import CartDrawer from "../cart-drawer/cart-drawer.tsx";
import {useCartStore} from "../../store/cart.ts";

const CartButton = () => {
    const totalAmount = useCartStore((state) => state.totalAmount);
    const items = useCartStore((state) => state.items);

    return (
        <CartDrawer>
            <div className="cart">
                <button className="btn-cart">
                    <b>{totalAmount} CZK</b>
                    <span className="cart-span"/>
                    <div className="shopping-cart">
                        <ShoppingCart className="shopping-cart-icon" strokeWidth={2}/>
                        <b>{items.length}</b>
                    </div>
                    <ArrowRight className="arrow-right"/>
                </button>
            </div>
        </CartDrawer>
    );
};

export default CartButton;