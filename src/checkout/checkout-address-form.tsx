import { FormTextarea } from "../form-components/form-text-area.tsx";
import { AddressInput } from "../components/address-input/address-input.tsx";

const CheckoutAddressForm = () => {
    return (
        <div className="white-block">
            <div className="checkout-content">
                <h1>3. Delivery address</h1>
                <AddressInput name="address" placeholder="Address" className="text-base" />
                <FormTextarea placeholder="Add comment to order" className="text-base" name="comment" />
            </div>
        </div>
    );
};

export default CheckoutAddressForm;