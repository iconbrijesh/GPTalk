import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'GPTalk',
      link: 'https://gptalk-6xim.onrender.com'
    }
  });

  const emailText = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHTML = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: '"GPTalk Support" <no-reply@gptalk.com>',
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHTML,
  };

  try {
    await transporter.sendMail(mail);
    console.log(`Email sent to ${options.email}`);
  } catch (err) {
    console.error("Email service failed.");
    console.error("Error:", err.message);
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => ({
  body: {
    name: username,
    intro: 'Welcome to GPTalk! We\'re excited to have you on board.',
    action: {
      instructions: 'To verify your email, click the button below:',
      button: {
        color: '#22BC66',
        text: 'Verify Email',
        link: verificationUrl,
      }
    },
    outro: 'Need help? Just reply to this email.'
  }
});

const forgotPasswordMailgenContent = (username, passwordResetUrl) => ({
  body: {
    name: username,
    intro: 'We received a request to reset your GPTalk account password.',
    action: {
      instructions: 'Click the button below to reset your password:',
      button: {
        color: '#e42110',
        text: 'Reset Password',
        link: passwordResetUrl,
      }
    },
    outro: 'If you didn’t request this, you can safely ignore this email.'
  }
});

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail
};