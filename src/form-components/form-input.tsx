import React from "react";
import {useFormContext} from "react-hook-form";
import './form-input.css';
import {X} from "lucide-react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    required?: boolean;
}

export const FormInput: React.FC<Props> = ({name, label, required, className, ...props}) => {
    const {
        register,
        formState: {errors},
        watch,
        setValue,
    } = useFormContext();

    const value = watch(name);
    const error = errors[name]?.message as string;

    const onClickClear = () => {
        setValue(name, '');
    }

    return (
        <div className={`form-input ${error ? 'form-input--error' : ''}`}>
            {label && (
                <label className="form-input__label">
                    {label} {required && <span className="form-input__required">*</span>}
                </label>
            )}

            <div className="form-input__container">
                <input
                    {...props}
                    {...register(name)}
                    className={`form-input__field ${className || ''}`}
                    data-testid={`${name}-input`}
                />

                {value && (
                    <button
                        type="button"
                        className="form-input__clear"
                        onClick={onClickClear}
                        aria-label="Clear input"
                    >
                        <X size={16}/>
                    </button>
                )}
            </div>

            {error && (
                <p className="form-input__error" data-testid={`${name}-error`}>
                    {error}
                </p>
            )}
        </div>
    )
}