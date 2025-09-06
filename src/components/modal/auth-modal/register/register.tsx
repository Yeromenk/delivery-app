
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formRegisterSchemas, type TFormRegisterValue } from '../schemas';
import { FormInput } from '../../../../form-components/form-input';
import { FormPhoneInput } from '../../../../form-components/form-phone-input';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const Register: React.FC = () => {
    const form = useForm<TFormRegisterValue>({
        resolver: zodResolver(formRegisterSchemas),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: TFormRegisterValue) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                password: data.password,
            }, { withCredentials: true });

            if (response.status !== 200) {
                toast.error('Registration failed. Please try again.');
                console.error('[REGISTER_RESPONSE_ERROR], ', response);
                return;
            }
            toast.success('Welcome!');
            window.dispatchEvent(new CustomEvent('auth:success'));
        } catch (error) {
            console.error('[REGISTER_ERROR], ', error);
            toast.error('Registration failed. Please try again.');
        }
    };

    return (
        <FormProvider {...form}>
            <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="auth-form-header">
                    <div>
                        <h1 className="auth-title">Create account</h1>
                        <p className="auth-subtitle">Fill in your details to get started</p>
                    </div>
                    <img className="auth-illustration" src='/images/lock.png' alt='Register Illustration' />
                </div>

                <FormInput name='fullName' label='Full name' placeholder='Enter your full name' />
                <FormInput name='email' label='Email' type='email' placeholder='Enter your email' />
                <FormPhoneInput name='phone' label='Phone' placeholder='Enter your phone number' />
                <FormInput name='password' label='Password' type='password' placeholder='Create a password' />
                <FormInput name='confirmPassword' label='Confirm password' type='password' placeholder='Re-enter your password' />

                <button className="auth-submit" type='submit' disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Creating…' : 'Create account'}
                </button>
            </form>
        </FormProvider>
    );
};

export default Register;
