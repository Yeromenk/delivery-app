import { Resend } from "resend";
import { EmailTemplates } from "../email-templates/email-templates";

interface EmailParams {
    orderId: number;
    totalAmount: number;
    paymentUrl: string;
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