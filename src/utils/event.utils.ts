import { EventEmitter } from "node:events";
import path from "node:path";
import { sendEmail } from "./sendEmail.utils";
import { template } from "sendEmailTemplate";

export const emailEvent = new EventEmitter();

emailEvent.on("confirmEmail",async(data)=>{
  const {to,code,firstName,subject} = data;
    await sendEmail({
        to,
        subject,
        html:template(code,firstName,subject),
        text: `Please confirm your email by clicking on the link: http://localhost:3000/confirm-email/${to}`,
        cc:"yahia.zakaria.sherif@gmail.com",
        bcc:"yahia.zakaria.sherif@gmail.com",
        attachments: [
          {
            filename: "sendMailData.txt",
            // content: "Hello",
            path: path.resolve(".", "sendMailData.txt")
          },
        ],
      });
})