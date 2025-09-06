import { FormProvider, useForm } from 'react-hook-form';
import { formLoginSchemas, type TFormLoginValue } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../../../../form-components/form-input';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export const Login = () => {
    const form = useForm<TFormLoginValue>({
        resolver: zodResolver(formLoginSchemas),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = async (data: TFormLoginValue) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                ...data,
            }, { withCredentials: true });

            if (response.status !== 200) {
                toast.error('Login failed. Please try again.');
                console.error('[LOGIN_RESPONSE_ERROR], ', response);
                return;
            }
            toast.success('Login successful!');
            window.dispatchEvent(new CustomEvent('auth:success'));
        } catch (error) {
            console.error('[LOGIN_ERROR], ', error);
            toast.error('Login failed. Please try again.');
        }
    }

    return (
        <FormProvider {...form}>
            <form className="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="auth-form-header">
                    <div>
                        <h1 className="auth-title">Sign in</h1>
                        <p className="auth-subtitle">Enter your credentials to access your account</p>
                    </div>
                    <img className="auth-illustration" src='/images/phone-icon.png' alt='Login Illustration' />
                </div>

                <FormInput name='email' label='Email' type='email' placeholder='Enter your email' />
                <FormInput name='password' label='Password' type='password' placeholder='Enter your password' />

                <button className="auth-submit" type='submit' disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </FormProvider>
    );
};

export default Login;
