import express from "express"
import { User } from "../database/models.js"
import { getToken, verifyToken } from "./jwt-sign-decode.js"
import { sendMailMsg } from "../mail/mail-client.js"

export const hello = async (req, res) => {
    res.json("hello")
}

export const finalMailRegister = async (req, res) => {
    const token = req.body.token
    if (!token) {
        const message = {
            msg: "wrong code"
        }
        res.status(400).json(message)
    } else {
        try {
            const decToken = verifyToken(token)
            const newUser = User.create(decToken)
            const message = {
                msg: "user has succesfully created",
                userId: newUser.id,
            }
            res.json(message)
        } catch (err) {
            console.log(err)
            res.status(500).json("oops, an occured error while creating user")
        }
    }
}

export const sendMailToRegister = async (req, res) => {
    const data = req.body
    const cleanData = {
        username: data.username,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber
    }

    const userEqEmail = await User.findAll({where: {email: data.email}})
    const userEqUsername = await User.findAll({where: {username: data.username}})
    if (userEqEmail.length == 0 && userEqUsername.length == 0) {
        try {
            const newToken = getToken(cleanData)
            const message = {
                msg: "mail has succesfully sended"
            }
            const mailMsg = {
                to: cleanData.email,
                subject: "email verify",
                text: `click to this link to complete register http://localhost:8000/api/final_register/${newToken}`
            }
            await sendMailMsg(mailMsg.to, mailMsg.subject, mailMsg.text)
            res.json(message)
        } catch (err) {
            console.log(err)
            res.status(500).json("oops, an occured error while sending email")
        }
    } else {
        res.status(400).json("user already exists")
    }
}