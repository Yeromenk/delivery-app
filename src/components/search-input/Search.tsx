import './Search.css'
import { Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Link } from "react-router-dom";
import axios from 'axios';

interface Product {
    id: number;
    name: string;
    imageUrl: string;
    categoryId: number;
}

const SearchInput = () => {
    const [focused, setFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [defaultProducts, setDefaultProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    useClickAway(ref, () => {
        setFocused(false);
    });

    // Load default products on mount
    useEffect(() => {
        const fetchDefaultProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');

                if (response.ok) {
                    const data = await response.json();
                    setDefaultProducts(data.slice(0, 5));
                } else {
                    console.error('Failed to fetch products:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching default products:', error);
            }
        };

        fetchDefaultProducts();
    }, []);

    // Debounced search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/products/search?query=${encodeURIComponent(searchQuery)}`);

                if (response.status === 200) {
                    const data = response.data;
                    setSearchResults(data.slice(0, 5));
                } else {
                    console.error('[PRODUCTS_SEARCH_ERROR], ', response.statusText);
                    setSearchResults([]);
                }
            } catch (error) {
                console.error('[PRODUCTS_SEARCH_ERROR], ', error);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleResultClick = () => {
        setFocused(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const displayProducts = searchQuery.trim() !== '' ? searchResults : defaultProducts;

    return (
        <>
            {focused && <div className="search-input-container" />}

            <div
                ref={ref}
                className="search-input">
                <Search className="search-input-icon" />
                <input
                    className="search-input-field"
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onFocus={() => setFocused(true)}
                    placeholder="Search for products..."
                />

                {focused && (
                    <div className={`search-input-results ${focused ? 'search-input-results-active' : ''}`}>
                        {loading && (
                            <div className="search-input-results-loading">
                                Searching...
                            </div>
                        )}

                        {!loading && searchQuery.trim() !== '' && searchResults.length === 0 && (
                            <div className="search-input-results-empty">
                                No products found
                            </div>
                        )}

                        {!loading && displayProducts.length === 0 && searchQuery.trim() === '' && (
                            <div className="search-input-results-empty">
                                No products available
                            </div>
                        )}

                        {!loading && displayProducts.map(product => (
                            <Link
                                key={product.id}
                                to={`/products/${product.id}`}
                                className="search-input-results-content"
                                onClick={handleResultClick}>
                                <img
                                    alt={product.name}
                                    src={product.imageUrl}
                                    className="search-input-results-image" />
                                <div className="search-input-results-info">
                                    <span className="search-input-results-name">{product.name}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchInput;