import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";
import "./form-input.css";
import { X } from "lucide-react";

interface Props {
    name: string;
    label?: string;
    required?: boolean;
    placeholder?: string;
    className?: string;
    mask?: string;
}

export const FormPhoneInput: React.FC<Props> = ({
    name,
    label,
    required,
    placeholder,
    className,
    mask = "+420 000 000 000", 
}) => {
    const {
        control,
        formState: { errors },
        watch,
        setValue,
    } = useFormContext();

    const value = watch(name);
    const error = errors[name]?.message as string;

    const onClickClear = () => {
        setValue(name, "");
    };

    return (
        <div className={`form-input ${error ? "form-input--error" : ""}`}>
            {label && (
                <label className="form-input__label">
                    {label} {required && <span className="form-input__required">*</span>}
                </label>
            )}

            <div className="form-input__container">
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <IMaskInput
                            {...field}
                            mask={mask}
                            lazy={false}
                            overwrite={false}
                            placeholder={placeholder || "Phone"}
                            className={`form-input__field ${className || ""}`}
                            onAccept={(val) => field.onChange(val)}
                        />
                    )}
                />

                {value && (
                    <button
                        type="button"
                        className="form-input__clear"
                        onClick={onClickClear}
                        aria-label="Clear phone"
                    >
                        <X size={16} />
                    </button>
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