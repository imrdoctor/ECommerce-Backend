import { EventEmitter } from 'events'
import { sendEmail } from './sendEmail';
import * as EmailTemplates from './templates.js';

export const eventEmitter = new EventEmitter()
eventEmitter.on("sendActiveEmailOTP", async (data) => {
    const title = "Verify Your Email"
    const descreption = "Some One USing Your Email For Registration"
    let Template = EmailTemplates.EmailotpTmeplate(data.code, title, descreption)
    const sendData = {
        title: "Verify Your Email",
        to: data.email,
        subject: "Verify Your Email",
        html: Template,
    }
   await sendEmail(sendData);
}
)