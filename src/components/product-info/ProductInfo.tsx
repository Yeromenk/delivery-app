import ProductImage from "../product-image/ProductImage.tsx";
import {useProduct} from "../../hooks/use-product.ts";
import './ProductInfo.css'
import GroupVariants from "../group-variants/group-variants.tsx";


const ProductInfo = ({params: {id}}: { params: { id: string } }) => {

    const {product, loading, error} = useProduct(id);

    if (loading) {
        return (
            <div className="product-info">
                <div className="loading">Loading product...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-info">
                <div className="error">
                    {error || 'Product not found'}
                </div>
            </div>
        );
    }

    return (
        <div className="product-info">
            <div className="product-info__image">
                <ProductImage imageUrl={product.imageUrl} size={40}/>

                <div className="product-info__info-text">
                    <h1>
                        {product.name}
                    </h1>

                    <p>
                        Loren ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>

                    <GroupVariants
                        selectedValue={"2"}
                        items={[
                            {
                                name: 'Small',
                                value: '1'
                            },
                            {
                                name: 'Medium',
                                value: '2'
                            },
                            {
                                name: 'Large',
                                value: '3'
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;