import React from "react";
import {useFormContext} from "react-hook-form";
import './form-text-area.css';
import {X} from "lucide-react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string;
    label?: string;
    required?: boolean;
}

export const FormTextarea: React.FC<Props> = ({name, label, required, className, ...props}) => {
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
        <div className={`form-textarea ${error ? 'form-textarea--error' : ''}`}>
            {label && (
                <label className="form-textarea__label">
                    {label} {required && <span className="form-textarea__required">*</span>}
                </label>
            )}

            <div className="form-textarea__container">
                <textarea
                    {...props}
                    {...register(name)}
                    className={`form-textarea__field ${className || ''}`}
                />

                {value && (
                    <button
                        type="button"
                        className="form-textarea__clear"
                        onClick={onClickClear}
                        aria-label="Clear textarea"
                    >
                        <X size={16}/>
                    </button>
                )}
            </div>

            {error && (
                <div className='form-textarea__error'>
                    <p className="form-textarea__error-text">{error}</p>
                </div>
            )}
        </div>
    )
}