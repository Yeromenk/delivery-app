import React from 'react';
import './cart-drawer-item.css';
import { CartItemDetailsImage } from '../cart-item-details/cart-item-details-image.tsx';
import type { CartItemProps } from '../cart-item-details/cart-item-details.types.ts';
import CartItemInfo from '../cart-item-details/cart-item-info.tsx';
import { CountButton } from '../count-button/count-button.tsx';
import { CartItemDetailsPrice } from '../cart-item-details/cart-item-details-price.tsx';
import { Trash2Icon } from 'lucide-react';

interface Props extends CartItemProps {
    onClickUpdateQuantity?: (type: 'plus' | 'minus') => void;
    onClickRemove?: () => void;
    updating?: boolean;
}

const CartDrawerItem: React.FC<Props> = ({
    imageUrl,
    details,
    name,
    price,
    quantity,
    onClickUpdateQuantity,
    onClickRemove,
    updating
}) => {
    return (
        <div className={`cart-drawer-item-root ${updating ? 'updating' : ''}`}>
            <CartItemDetailsImage src={imageUrl} />

            <div className="cart-drawer-item">
                <CartItemInfo details={details} name={name} />

                <hr />

                <div className="cart-drawer-item-price">
                    <CountButton value={quantity} onClick={onClickUpdateQuantity} className={updating ? 'is-loading' : ''} loading={updating} />

                    <div className="cart-drawer-item-delete">
                        <CartItemDetailsPrice value={price} loading={Boolean(updating)} />
                        <Trash2Icon
                            size={16}
                            className="cart-drawer-item-delete-icon"
                            onClick={onClickRemove}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartDrawerItem;