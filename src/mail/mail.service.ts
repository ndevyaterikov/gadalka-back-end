import { Injectable } from '@nestjs/common';
const nodemailer = require('nodemailer')


@Injectable()
export class MailService {
    private transporter: any;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            sequre:false,
            auth:{
                user: process.env.SMTP_INFO_USER,
                pass: process.env.SMTP_INFO_USER_PASS
            }
        })
    }

    async sendActivationMail(to, link){

        await this.transporter.sendMail({
            from:"info@pogadaytaro.ru",
            to,
            subject:"Активация аккаунта на www.pogadaytaro.ru",
            text:'',
            html:
                `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    }
}
