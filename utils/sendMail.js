const nodemailer = require('nodemailer');

const sendMail = async ({ recipientName, recipientEmail, jwt }) => {
  // Generate SMTP service account from ethereal.email

  // NB! Store the account object values somewhere if you want
  // to re-use the same account for future mail deliveries

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
            ${process.env.BASE_URL}/confirmation/${jwt}
        `,

    // HTML body
    html: `<p><b>Hello</b> Please click the link below to confirm your email address.</p><br/><a rel='nofollow' href='${process.env.BASE_URL}/confirmation/${jwt}'>CONFIRM.</a>`

    /*
        // An array of attachments
        attachments: [
            // String attachment
            {
                filename: '',
                content: '',
                contentType: '' // optional, would be detected from the filename
            },

            // Binary Buffer attachment
            {
                filename: 'image.png',
                content: Buffer.from(
                    '',
                    'base64'
                ),

                cid: 'note@example.com' // should be as unique as possible
            },

            // File Stream attachment
            {

            }
        ] */
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      return err.message;
    }

    return nodemailer.getTestMessageUrl(info);
  });

  // only needed when using pooled connections
  // transporter.close();
};

const sendMagicLink = async ({
  recipientName,
  recipientEmail,
  student,
  jwt
}) => {
  // Generate SMTP service account from ethereal.email

  // NB! Store the account object values somewhere if you want
  // to re-use the same account for future mail deliveries

  // Create a SMTP transporter object
  console.log('sending magic link');
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
    subject: `See credential shared by ${student}`,

    // plaintext body
    text: `Please click the link below to verify ${student}'s credential.
            ${process.env.BASE_URL}/verifyCred/${jwt}
        `,

    // HTML body
    html: `<p><b>Hello</b> Please click the link below to verify ${student}'s credential.</p><br/><a rel='nofollow' href='${process.env.BASE_URL}/verifyCred/${jwt}'>CONFIRM.</a>`

    /*
        // An array of attachments
        attachments: [
            // String attachment
            {
                filename: '',
                content: '',
                contentType: '' // optional, would be detected from the filename
            },

            // Binary Buffer attachment
            {
                filename: 'image.png',
                content: Buffer.from(
                    '',
                    'base64'
                ),

                cid: 'note@example.com' // should be as unique as possible
            },

            // File Stream attachment
            {

            }
        ] */
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      return err.message;
    }

    return nodemailer.getTestMessageUrl(info);
  });

  // only needed when using pooled connections
  // transporter.close();
};

module.exports = {
  sendMail,
  sendMagicLink
};
