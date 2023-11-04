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
            if (!decToken.username) {
                return res.status(400).json('wrong code')
            } else {
                const userEqEmail = await User.findAll({ where: {email: decToken.email}})
                const userEqUsername = await User.findAll({ where: {username: decToken.username}})
                console.log(userEqEmail, userEqUsername)
                if (userEqEmail.length == 0 && userEqUsername.length == 0) {
                    console.log('-------user succ reg')
                    const newUser = User.create(decToken)
                    const message = {
                        msg: "user has succesfully created",
                        userId: newUser.id,
                    }
                    res.json(message)
                } else {
                    res.status(403).json('user already existed')
                }
            }
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
        phoneNumber: data.phoneNumber,
    }
    const userEqEmail = await User.findAll({where: {email: data.email}})
    const userEqUsername = await User.findAll({where: {username: data.username}})
    console.log(userEqEmail)
    console.log(userEqUsername)
    if (userEqEmail.length == 0 && userEqUsername.length == 0) {
        try {
            const newToken = getToken(cleanData)
            const message = {
                msg: "mail has succesfully sended"
            }
            const mailMsg = {
                to: cleanData.email,
                subject: "email verify",
                text: `click to this link to complete register http://localhost:3000/verify?token=${newToken}`
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