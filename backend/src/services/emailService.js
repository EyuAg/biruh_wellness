const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');

const sendEmail = async ({ to, subject, template, data }) => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
        logger.info('Email service skipped; SMTP not configured', {
            to,
            subject,
            template,
            data
        });
        return true;
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort || 587),
        secure: false,
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });

    const html = `
        <div style="font-family: Arial, sans-serif;">
            <h3>Biruh Wellness</h3>
            <p>${data?.name || 'Hello'}</p>
            <p>This is a ${template} email.</p>
        </div>
    `;

    await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@biruhwellness.com',
        to,
        subject,
        html
    });

    return true;
};

module.exports = {
    sendEmail
};
