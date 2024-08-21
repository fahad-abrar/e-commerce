import nodemailer from 'nodemailer'

const sendMail = async (mailBody) => {

    const mail = process.env.SMTP_MAIL
    const pass = process.env.SMTP_MAIL_PASS
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: mail,
            pass: pass  
        }
    })

    const mailOption = {
        from: mail,
        to: mailBody.to,
        subject: mailBody.subject,
        text: mailBody.text
    }

    await transporter.sendMail(mailOption)
}

export default sendMail