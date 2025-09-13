import './group-variants.css'
import React from "react";

type Variant = {
    name: string;
    value: string;
    isDisabled?: boolean;
}

interface Props {
    items: readonly Variant[];
    defaultValue?: string;
    onClick?: (value: Variant['value']) => void;
    selectedValue?: Variant['value'];

}

const GroupVariants: React.FC<Props> = ({
                           items,
                           onClick,
                           selectedValue,
                       }) => {
    return (
        <div className="group-variants">
            {items.map((item) => (
                <button
                    key={item.name}
                    onClick={() => onClick?.(item.value)}
                    className={`group-variants-item ${
                        item.value === selectedValue ? 'active' : ''
                    } ${item.isDisabled ? 'disabled' : ''}`}
                    data-testid="size-option"
                >
                    {item.name}
                </button>
            ))}
        </div>
    );
};

export default GroupVariants;