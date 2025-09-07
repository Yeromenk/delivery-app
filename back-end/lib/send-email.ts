import { Resend } from "resend";
import { EmailTemplates, PaymentSuccessEmailTemplate, PaymentFailedEmailTemplate } from "../email-templates/email-templates";

interface EmailParams {
    orderId: number;
    totalAmount: number;
    paymentUrl: string;
}

interface PaymentStatusEmailParams {
    orderId: number;
    totalAmount: number;
    customerEmail: string;
}

export const SendEmail = async (to: string, subject: string, params: EmailParams) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject,
        html: EmailTemplates(params),
    });

    if (error) {
        throw error;
    }

    return data;
};

export const SendPaymentSuccessEmail = async (to: string, params: PaymentStatusEmailParams) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject: `Ye-pizza / Payment Successful - Order #${params.orderId}`,
        html: PaymentSuccessEmailTemplate(params),
    });

    if (error) {
        throw error;
    }

    return data;
};

export const SendPaymentFailedEmail = async (to: string, params: PaymentStatusEmailParams) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject: `Ye-pizza / Payment Failed - Order #${params.orderId}`,
        html: PaymentFailedEmailTemplate(params),
    });

    if (error) {
        throw error;
    }

    return data;
};