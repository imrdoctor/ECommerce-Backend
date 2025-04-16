import { createTransport, SendMailOptions } from 'nodemailer';

export const sendEmail = async (sendData: SendMailOptions) => {
  console.log(process.env.AUTH_EMAIL, process.env.AUTH_EMAIL_PASSWORD);
  
  const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const info = await transporter.sendMail({
    from: `${sendData.title} ${process.env.AUTH_EMAIL}`,
    to: sendData.to ? sendData.to : null,
    subject: sendData.subject,
    html: sendData.html ? sendData.html : null,
    attachments: sendData.attachments ? sendData.attachments : [],
  });
  if (info.accepted && info.accepted.length > 0) {
    return true;
  } else {
    return false;
  }
};
