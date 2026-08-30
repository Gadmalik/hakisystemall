import { Resend } from 'resend';
export async function sendMail({to, subject, text}){
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
        from: process.env.NO_REPLAY_MAIL,
        to: to,
        subject: subject,
        html: text
        });
        console.log("mail sent to ",to);
        return {success:true, code:"success", message:"Mail sent successfully"};
    } catch (error) {
        console.error(error);
        return {success:false, code:"error", message:"Une erreur s'est produite !", error: error};
    }
}