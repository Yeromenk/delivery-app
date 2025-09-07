import { z } from "zod";

export const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters long" });

export const formLoginSchemas = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: passwordSchema,
})

export const formRegisterSchemas = formLoginSchemas.merge(

    z.object({
        fullName: z.string().min(2, { message: "Full name must be at least 2 characters long" }),
        phone: z
            .string()
            .min(7, { message: 'Phone is required' })
            .regex(/^\+420[ -]?\d{3}[ -]?\d{3}[ -]?\d{3}$/, { message: 'Invalid Czech phone number format. Use format: +420 XXX XXX XXX or +420XXXXXXXXX' }),
        confirmPassword: passwordSchema,
    })
).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
})

export type TFormLoginValue = z.infer<typeof formLoginSchemas>;
export type TFormRegisterValue = z.infer<typeof formRegisterSchemas>;