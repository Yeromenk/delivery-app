import { useEffect } from 'react';
import './product-modal.css';

interface Props {
    onClose: () => void;
    children: React.ReactNode;
}

export const ProductModal: React.FC<Props> = ({ onClose, children }) => {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    return (
        <div className="product-modal-backdrop" onClick={onClose}>
            <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default ProductModal;
