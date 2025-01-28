const nodemailer = require('nodemailer');

module.exports = async (url, email, token) => {
  const transporter = nodemailer.createTransport({
    host: 'mxslurp.click',
    port: '2525',
    secure: false,
    auth: {
      user: '39164557-b978-4c7f-9968-30da5ae6dadc@mailslurp.biz',
      pass: 'zL5OPJ8AFfgnJO4P9vzkF1sRVbh0l6KA',
    },
  });

  const verificationUrl = `http://localhost:3334/api/v1/auth/${url}?token=${token}`;

  await transporter.sendMail({
    from: '39164557-b978-4c7f-9968-30da5ae6dadc@mailslurp.biz', //our email
    to: email, //new email
    subject: 'Verify your new email address',
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify if you don't do this please ignore this message.</p>`,
  });
  console.log(`Verification email sent to ${email}`);
};
