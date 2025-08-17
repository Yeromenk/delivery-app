import FilterCheckBox from "../filter-checkbox/FilterCheckBox.tsx";
import React, {useState} from "react";
import './IngredientsFilter.css'
import Skeleton from "../skeleton/Skeleton.tsx";

type Item = FilterCheckBox;

interface IngredientsFilterProps {
    title: string;
    items: Item[];
    defaultItems?: Item[];
    limit?: number;
    loading?: boolean;
    searchInputPlaceholder?: string;
    onChange?: (id: string) => void;
    selectedIds?: Set<string>;
    name?: string;
    showToggle?: boolean;
}

const IngredientsFilter: React.FC<IngredientsFilterProps> = ({
                                                                 title,
                                                                 items,
                                                                 defaultItems,
                                                                 limit = 5,
                                                                 searchInputPlaceholder = "Search ingredients...",
                                                                 onChange,
                                                                 loading = false,
                                                                 selectedIds,
                                                                 name,
                                                                 showToggle = false, // По умолчанию скрыта
                                                             }) => {
    const [showAll, setShowAll] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const list = showAll
        ? items.filter((item) => item.text.toLowerCase().includes(searchValue.toLowerCase()))
        : (defaultItems || items).slice(0, limit);

    const onChangeSearchInput = (value: string) => {
        setSearchValue(value);
    }

    if (loading) {
        return (
            <div className="ingredients-filter-container">
                <p>{title}</p>
                <Skeleton count={limit}/>
            </div>
        );
    }

    return (
        <div className="ingredients-filter-container">
            <p>
                {title}
            </p>

            {showAll && showToggle && (
                <div className="ingredients-filter">
                    <input
                        placeholder={searchInputPlaceholder}
                        className="ingredients-input"
                        value={searchValue}
                        onChange={(e) => onChangeSearchInput(e.target.value)}
                    />
                </div>
            )}

            <div className="ingredients-scroll">
                {list.map((item, index) => (
                    <FilterCheckBox
                        key={index}
                        text={item.text}
                        value={item.value}
                        endAdornment={item.endAdornment}
                        checked={selectedIds?.has(item.value)}
                        onCheckedChange={() => onChange?.(item.value)}
                        name={name}
                    />
                ))}
            </div>

            {showToggle && items.length > limit && (
                <div className="ingredients-show-all">
                    <button
                        className="ingredients-show-all-btn"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? "Show less" : `Show all (${items.length})`}
                    </button>
                </div>
            )}
        </div>
    )
}

export default IngredientsFilter;