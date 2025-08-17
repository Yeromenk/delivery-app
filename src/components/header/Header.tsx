import './Header.css'
import { User} from "lucide-react";
import {Link} from "react-router-dom";
import SearchInput from "../search-input/Search";
import logo from "../../assets/images/logo.png";
import CartButton from "../cart-button/cart-button.tsx";

const Header = () => {
    return (
        <header className="header">
            <div className="container">

                {/*Left part*/}
                <div className="left-header">
                    <Link to="/" className="logo-link">
                        <img src={logo} width={35} height={35} alt="Logo"/>
                    </Link>
                    <div>
                        <h1>
                            Pizza Delivery
                        </h1>
                        <p>
                            The best pizza in town
                        </p>
                    </div>
                </div>

                {/*Search*/}
                <div className="search-header">
                    <SearchInput/>
                </div>


                {/*Right part*/}
                <div className="right-header">
                    <button className="btn-sign-in">
                        <User size={16}/>
                        Sign in
                    </button>

                    <CartButton/>
                </div>
            </div>
        </header>
    );
};

export default Header;