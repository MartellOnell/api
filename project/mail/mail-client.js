import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    sequre: true,
    auth: {
        user: "car.pet.pydj@yandex.ru",
        pass: "makstr78"
    }
})

export const sendMailMsg = async (to, subject, text) => {
    await transporter.sendMail({
        from: "car.pet.pydj@yandex.ru",
        to: to,
        subject: subject,
        text: text,
    })
}