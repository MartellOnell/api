import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "",
    port: 0,
    sequre: true,
    auth: {
        user: "user@mail.com",
        pass: "pass"
    }
})

export const sendMailMsg = async (to, subject, text) => {
    await transporter.sendMail({
        from: "user@mail.com",
        to: to,
        subject: subject,
        text: text,
    })
}