import { EventEmitter } from 'events'
import { sendEmail } from './sendEmail';
import * as EmailTemplates from './templates.js';

export const eventEmitter = new EventEmitter()
eventEmitter.on("sendActiveEmailOTP", async (data) => {
    const title = "Verify Your Email"
    const descreption = "To complete your registration, enter the following OTP code"
    let Template = EmailTemplates.EmailotpTmeplate(data.otp, title, descreption)
    const sendData = {
        title: "Verify Your Email",
        to: data.email,
        subject: "Verify Your Email",
        html: Template,
    }
   const sendEmaill =  await sendEmail(sendData);
    console.log("Email Sent",sendEmaill)
})