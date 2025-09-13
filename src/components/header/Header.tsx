import './Header.css'
import { Link } from "react-router-dom";
import SearchInput from "../search-input/Search";
import logo from "../../assets/images/logo.png";
import CartButton from "../cart-button/cart-button.tsx";
import React from "react";
import { Profile } from '../profile/profile.tsx';

interface IProps {
    hasSearch?: boolean;
    hasCart?: boolean;
}

const Header: React.FC<IProps> = ({ hasSearch = true, hasCart = true }) => {
    return (
        <header className="header" data-testid="header">
            <div className="container">

                {/*Left part*/}
                <div className="left-header">
                    <Link to="/" className="logo-link" aria-label="Go to homepage">
                        <img src={logo} width={35} height={35} alt="Pizza Delivery Logo" data-testid="logo" />
                    </Link>
                    <Link to="/" className="brand-link" aria-label="Go to homepage">
                        <div>
                            <h1>
                                Pizza Delivery
                            </h1>
                            <p>
                                The best pizza in town
                            </p>
                        </div>
                    </Link>
                </div>

                {/*Search*/}
                {hasSearch && (
                    <div className="search-header">
                        <SearchInput />
                    </div>
                )}


                {/*Right part*/}
                <div className="right-header">
                    <Profile />

                    {hasCart && (
                        <CartButton />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;