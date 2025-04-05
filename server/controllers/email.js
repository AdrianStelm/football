const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASS
  }
});

module.exports = transporter;