import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import { FormProvider, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { FormInput } from "../../form-components/form-input"
import { FormPhoneInput } from "../../form-components/form-phone-input"
import axios from 'axios';
import type { ProfileUpdatePayload } from '../../types/api.types';
import './profile-form.css';

const profileSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    phone: z
        .string()
        .optional()
        .refine((v) => !v || /^\+420[ -]?\d{3}[ -]?\d{3}[ -]?\d{3}$/.test(v), { message: 'Invalid Czech phone number format. Use format: +420 XXX XXX XXX or +420XXXXXXXXX' }),
    password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
    if (!data.password) return true;
    return data.password === data.confirmPassword;
}, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export const ProfileForm = () => {
    const navigate = useNavigate();
    type ProfileFormValues = z.infer<typeof profileSchema>;
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        }
    })

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/auth/me', { withCredentials: true });
                if (data?.user) {
                    form.reset({
                        fullName: data.user.fullName || '',
                        email: data.user.email || '',
                        phone: data.user.phone || '',
                        password: '',
                        confirmPassword: '',
                    });
                }
            } catch (error) {
                console.log("[USER_DATA_ERROR], ", error);
            }
        })();
    }, [form]);

    const onSubmit = async (values: ProfileFormValues) => {
        try {
            const payload: ProfileUpdatePayload = {
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
            };
            if (values.password) {
                payload.password = values.password;
                payload.confirmPassword = values.confirmPassword;
            }
            await axios.put('http://localhost:5000/api/auth/me', payload, { withCredentials: true });

            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile.');
            console.log('[PROFILE_UPDATE_ERROR], ', error);
        }
    }

    const signOut = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
            toast.success('Logged out');

            try {
                localStorage.removeItem('token');
            } catch (error) {
                console.error('[LOCAL_STORAGE_ERROR], ', error);
            }

            window.dispatchEvent(new Event('auth:logout'));
            await new Promise((r) => setTimeout(r, 700));
            navigate('/');
        } catch (e) {
            toast.error('Logout failed');
            console.log('[LOGOUT_ERROR], ', e);
        }
    }

    return (
        <div className="profile-form-container">
            <h1>Personal information</h1>

            <FormProvider {...form}>
                <form className="profile-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormInput name="email" label="Email" required />
                    <FormInput name="fullName" label="Full Name" required />
                    <FormPhoneInput name="phone" label="Phone" />

                    <FormInput name="password" label="Password" type="password" autoComplete="new-password" />
                    <FormInput name="confirmPassword" label="Confirm Password" type="password" autoComplete="new-password" />

                    <div className="profile-actions">
                        <button
                            className="update-profile-button"
                            type="submit"
                            disabled={form.formState.isSubmitting}>
                            Update Profile
                        </button>
                    </div>

                    <div className="logout-section">
                        <button
                            type="button"
                            onClick={signOut}
                            disabled={form.formState.isSubmitting}
                            className="logout-button">
                            Log out
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}