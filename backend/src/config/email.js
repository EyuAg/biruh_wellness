const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');
require('dotenv').config();

const getEmailConfig = () => ({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    from: process.env.SMTP_FROM || 'no-reply@biruhwellness.com'
});

const isEmailConfigured = () => {
    const { host, auth } = getEmailConfig();
    return Boolean(host && auth?.user && auth?.pass);
};

const createEmailTransporter = () => {
    if (!isEmailConfigured()) {
        return null;
    }

    const { host, port, secure, auth } = getEmailConfig();

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth
    });
};

const sendMail = async ({ to, subject, html, text }) => {
    const transporter = createEmailTransporter();

    if (!transporter) {
        logger.info('Email service skipped; SMTP is not configured', {
            to,
            subject
        });
        return false;
    }

    await transporter.sendMail({
        from: getEmailConfig().from,
        to,
        subject,
        html,
        text
    });

    return true;
};

module.exports = {
    getEmailConfig,
    isEmailConfigured,
    createEmailTransporter,
    sendMail
};

