import React, { useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import './address-input.css';
import { X, MapPin } from 'lucide-react';
import axios from 'axios';

interface Props {
    name: string;
    placeholder?: string;
    className?: string;
}

interface AddressSuggestion {
    display_name: string;
    place_id: string;
    lat: string;
    lon: string;
}

export const AddressInput: React.FC<Props> = ({ name, placeholder, className }) => {
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        setValue,
        formState: { errors }
    } = useFormContext();

    const error = errors[name]?.message as string;

    const fetchSuggestions = async (query: string) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&countrycodes=cz&q=${encodeURIComponent(query)}`;

            const response = await axios.get(url, {
                timeout: 5000,
            });

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = response.data;

            setSuggestions(data.map((item: any) => {
                const address = item.address || {};

                const mainParts = [
                    address.house_number,
                    address.road || address.street,
                    address.suburb || address.neighbourhood || address.quarter,
                    address.city || address.town || address.village || address.municipality
                ].filter(Boolean);

                const shortAddress = mainParts.slice(0, 3).join(', ');

                return {
                    display_name: shortAddress || item.display_name,
                    place_id: item.place_id,
                    lat: item.lat,
                    lon: item.lon,
                    full_address: item.display_name
                };
            }));
        } catch (error) {
            console.error("[ADDRESS_FETCH_ERROR], ", error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (inputValue && showSuggestions && inputValue.length >= 3) {
                fetchSuggestions(inputValue);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [inputValue, showSuggestions]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        setValue(name, newValue);

        if (newValue.length >= 3) {
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: AddressSuggestion) => {
        setInputValue(suggestion.display_name);
        setValue(name, suggestion.display_name);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    const handleInputFocus = () => {
        if (inputValue.length >= 3) {
            setShowSuggestions(true);
        }
    };

    const handleInputBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    const handleClear = () => {
        setInputValue('');
        setValue(name, '');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className={`form-input ${error ? 'form-input--error' : ''}`}>
            <div className="form-input__container">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={`form-input__field ${className || ''}`}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    autoComplete="street-address"
                />

                {inputValue && (
                    <button
                        type="button"
                        className="form-input__clear"
                        onClick={handleClear}
                        aria-label="Clear address"
                    >
                        <X size={16} />
                    </button>
                )}

                {showSuggestions && (suggestions.length > 0 || isLoading) && (
                    <div className="address-suggestions">
                        {isLoading && (
                            <div className="address-suggestion address-suggestion--loading">
                                Loading addresses...
                            </div>
                        )}

                        {suggestions.map((suggestion) => (
                            <div
                                key={suggestion.place_id}
                                className="address-suggestion"
                                onClick={() => handleSuggestionClick(suggestion)}
                                role="button"
                                tabIndex={0}
                            >
                                <MapPin size={12} className="address-suggestion__icon" />
                                <span className="address-suggestion__text">
                                    {suggestion.display_name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <div className="form-input__error">
                    <p className="form-input__error-text">{error}</p>
                </div>
            )}
        </div>
    );
};