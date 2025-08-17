import './cart-button.css';
import {ShoppingCart, ArrowRight} from 'lucide-react';
import CartDrawer from "../cart-drawer/cart-drawer.tsx";

const CartButton = () => {
    return (
        <CartDrawer>
            <div className="cart">
                <button className="btn-cart">
                    <b>230 CZK</b>
                    <span className="cart-span"/>
                    <div className="shopping-cart">
                        <ShoppingCart className="shopping-cart-icon" strokeWidth={2}/>
                        <b>2</b>
                    </div>
                    <ArrowRight className="arrow-right"/>
                </button>
            </div>
        </CartDrawer>
    );
};

export default CartButton;