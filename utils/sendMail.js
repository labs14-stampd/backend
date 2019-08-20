const nodemailer = require('nodemailer');

const sendMail = async ({
    recipientName,
    recipientEmail
}) => {
    // Generate SMTP service account from ethereal.email
    let account = await nodemailer.createTestAccount();


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
    let message = {
        // Comma separated list of recipients
        from: `"Team Stampd" <${process.env.NODEMAILER_ADDRESS}>`,
        to: `"${recipientName}" <${recipientEmail}>`,



        // Subject of the message
        subject: 'Email Confirmation',

        // plaintext body
        text: 'Please click the link below to confirm your email address.',

        // HTML body
        html: '<p><b>Hello</b> Please click the link below to confirm your email address.</p>',

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
        ]*/
    };

    transporter.sendMail(message, (err, info) => {
        if (err) {
            console.log('Error: ', err.message);
        }

        console.log('Message sent successfully!');
        console.log(nodemailer.getTestMessageUrl(info));
    });

    // only needed when using pooled connections
    //transporter.close();




}

module.exports = {
    sendMail
};