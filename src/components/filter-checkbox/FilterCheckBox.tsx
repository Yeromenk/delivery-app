import * as React from "react";
import "./FilterCheckBox.css";

export interface FilterCheckBox {
    text: string;
    value: string;
    endAdornment?: React.ReactNode;
    onCheckedChange?: (checked: boolean) => void;
    checked?: boolean;
    name?: string;
}

export const FilterCheckBox: React.FC<FilterCheckBox> = ({
                                                             text,
                                                             value,
                                                             endAdornment,
                                                             onCheckedChange,
                                                             checked,
                                                             name,
                                                         }) => {
    return (
        <div className="checkbox">
            <input
                type="checkbox"
                onChange={(e) => onCheckedChange?.(e.target.checked)}
                checked={checked}
                value={value}
                className="checkbox-input"
                id={`checkbox-${String(name)}-${String(value)}`}
            />
            <label
                htmlFor={`checkbox-${String(name)}-${String(value)}`}
                className="label-checkbox">
                {text}
            </label>
            {endAdornment}
        </div>
    )
}


export default FilterCheckBox;