import RangeSlider from "../range-slider/RangeSlider.tsx";
import IngredientsFilter from "../ingredients-filter/IngredientsFilter.tsx";
import './Filters.css'
import {useEffect} from 'react';
import qs from 'qs';
import {useFilterState} from "../../hooks/use-filter-state.ts";

const Filters = () => {
    const {
        ingredients,
        loading,
        selectedIds,
        onAddId,
        prices,
        setPrices,
        handlePriceChange,
        sizes,
        toggleSizes,
        pizzaTypes,
        togglePizzaTypes
    } = useFilterState();

    const filterItems = ingredients.map(item => ({
        value: String(item.id),
        text: item.name,
    }));

    useEffect(() => {
        const filters = {
            ...prices,
            pizzaTypes: Array.from(pizzaTypes),
            sizes: Array.from(sizes),
            ingredients: Array.from(selectedIds),
        }

        const queryString = qs.stringify(filters, {
            arrayFormat: 'comma'
        });

        const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
        window.history.pushState({}, '', newUrl);

    }, [prices, pizzaTypes, sizes, selectedIds]);

    return (
        <div>
            <h2>Filtration</h2>

            <div className="filter">
                <IngredientsFilter
                    title={"Sizes"}
                    name={'Sizes'}
                    selectedIds={sizes}
                    items={[
                        {text: '20 cm', value: '20'},
                        {text: '30 cm', value: '30'},
                        {text: '40 cm', value: '40'}
                    ]}
                    onChange={toggleSizes}
                    showToggle={false}
                />

                <IngredientsFilter
                    title={"Pizza Types"}
                    name={'Pizza Types'}
                    selectedIds={pizzaTypes}
                    items={[
                        {text: 'Thin', value: '1'},
                        {text: 'Traditional', value: '2'}
                    ]}
                    onChange={togglePizzaTypes}
                    showToggle={false}
                />
            </div>

            <div className="price">
                <p>Price from & to:</p>
                <div className="input-price">
                    <input
                        type="number"
                        placeholder="0"
                        min={0}
                        max={1000}
                        value={String(prices.priceFrom || '')}
                        onChange={(e) => handlePriceChange('priceFrom', Number(e.target.value))}
                    />
                    <input
                        type="number"
                        placeholder="1000"
                        min={0}
                        max={1000}
                        value={String(prices.priceTo || '')}
                        onChange={(e) => handlePriceChange('priceTo', Number(e.target.value))}
                    />
                </div>

                <RangeSlider
                    min={0}
                    max={1000}
                    step={50}
                    value={[prices.priceFrom || 0, prices.priceTo || 1000]}
                    onValueChange={([priceFrom, priceTo]) => setPrices({priceFrom, priceTo})}
                />
            </div>

            <IngredientsFilter
                title={"Ingredients"}
                name={"ingredients"}
                items={filterItems}
                defaultItems={filterItems.slice(0, 6)}
                limit={5}
                loading={loading}
                onChange={onAddId}
                selectedIds={selectedIds}
                showToggle={true}
            />
        </div>
    );
};

export default Filters;