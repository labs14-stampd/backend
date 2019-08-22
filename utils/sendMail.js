const nodemailer = require('nodemailer');

const sendMail = async ({ recipientName, recipientEmail, jwt }) => {
  // Create a SMTP transporter object

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_ADDRESS,
      pass: process.env.NODEMAILER_PASSWORD
    }
  });

  // Message object
  const message = {
    // Comma separated list of recipients
    from: `"Team Stampd" <${process.env.NODEMAILER_ADDRESS}>`,
    to: `"${recipientName}" <${recipientEmail}>`,

    // Subject of the message
    subject: 'Email Confirmation',

    // plaintext body
    text: `Please click the link below to confirm your email address.
            http://localhost:4000/confirmation/${jwt}
        `,

    html: `<p><b>Hello</b> Please click the link below to confirm your email address.</p><br/><a rel='nofollow' href='http://localhost:4000/confirmation/${jwt}'>CONFIRM.</a>`
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      return err.message;
    }

    return nodemailer.getTestMessageUrl(info);
  });
};

module.exports = {
  sendMail
};
