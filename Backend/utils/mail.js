import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';


const sendEmail = async (options) => {
    const mailgenerator = new Mailgen({
        theme: 'default',
        product: {
            // Appears in header & footer of e-mails
            name: 'GPTalk',
            link: 'https://taskmanagerlink.com'

        }
    })
    const emailTextual = mailgenerator.generatePlaintext(options.mailgenContent)
    const emailHTML = mailgenerator.generate(options.mailgenContent)

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,

        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },
    });

    const mail ={
        from: "mail.GPTalk@gmail.com",
        to: options.email,
        subject: options.subject,
        text:  emailTextual, // plain‑text body
        html: emailHTML, // HTML body

    }
    try{
        await transporter.sendMail(mail)

    }catch(err){
        console.error("email service failed siliently.")
        console.error("Error:", err)

    }


  
};


const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: 'Welcome to GPTalk! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with GPTalk, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Confirm your account',
                    link: verificationUrl,
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'

        }
    }
};
const forgotpasswordEmail = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: 'We got request to reset the password account',
            action: {
                instructions: 'To reset the password click on link/button, please click here:',
                button: {
                    color: '#e42110ff', // Optional action button color
                    text: 'Reset',
                    link: passwordResetUrl,
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'

        }
    }
};
export{
    emailVerificationMailgenContent,
    forgotpasswordEmail,
    sendEmail 

};