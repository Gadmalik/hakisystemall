import { Resend } from 'resend';

export async function sendMail({to, subject, text}){
    if (!to) {
        return { success: false, code: "no_recipient", message: "Aucune adresse email spécifiée" };
    }
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.NO_REPLAY_MAIL || "HAKI SYSTEM <no-reply@hakisystem.net>";

    if (!apiKey) {
        console.warn(`[Mail] Aucun RESEND_API_KEY configuré. Envoi simulé à: ${to} (Sujet: ${subject})`);
        return { success: true, simulated: true, message: "Envoi d'e-mail simulé en mode dev" };
    }

    try {
        const resend = new Resend(apiKey);
        const result = await resend.emails.send({
            from: fromEmail,
            to: to,
            subject: subject,
            html: text
        }).catch((error) => {
            console.error(`[Mail Error] Échec de l'envoi d'e-mail à ${to}:`, error?.message || error);
            return { success: false, code: "mail_error", message: error?.message || "Échec d'envoi d'email", error };
        });
        console.log(`[Mail] E-mail envoyé avec succès à ${to} - ID:`, result?.data?.id || "ok");
        return { success: true, code: "success", message: "Mail sent successfully", id: result?.data?.id };
    } catch (error) {
        console.error(`[Mail Error] Échec de l'envoi d'e-mail à ${to}:`, error?.message || error);
        return { success: false, code: "mail_error", message: error?.message || "Échec d'envoi d'email", error };
    }
}