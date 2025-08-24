import { z } from "zod";

export const checkoutFormSchema = z.object({
    firstName: z.string().min(2, {message: "First name is required"}).max(50, {message: "First name is too long"}),
    lastName: z.string().min(2, {message: "Last name is required"}).max(50, {message: "Last name is too long"}),
    email: z.string().email({message: "Invalid email address"}),
    phone: z.string()
        .min(1, {message: "Phone number is required"})
        .regex(/^\+420 \d{3} \d{3} \d{3}$/, {message: "Invalid Czech phone number format"}),
    address: z.string().min(5, {message: "Address is required"}),
    comment: z.string().max(300, {message: "Comment is too long"}).optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;