import { FormInput } from "../form-components/form-input.tsx";
import { FormPhoneInput } from "../form-components/form-phone-input.tsx";

const CheckoutPersonalInfo = () => {
    return (
        <div className="white-block">
            <div className="checkout-content">
                <h1>2. Personal data</h1>
                <div className="form-row">
                    <FormInput name="firstName" placeholder="First Name"/>
                    <FormInput name="lastName" placeholder="Last Name"/>
                </div>
                <div className="form-row">
                    <FormInput name="email" placeholder="Email"/>
                    <FormPhoneInput name="phone" placeholder="Phone"/>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPersonalInfo;