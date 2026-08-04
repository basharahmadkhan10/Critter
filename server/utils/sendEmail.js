const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter using Mailtrap SMTP credentials
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
    });

    // 2. Define the email options
    const mailOptions = {
        from: 'Critter App <hello@demomailtrap.com>',
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
