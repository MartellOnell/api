import { User } from "../database/models.js"
import { getRegisterToken, verifyToken, getAuthToken } from "./jwt-sign-decode.js"
import { sendMailMsg } from "../mail/mail-client.js"

export const login = async (req, res) => {
    const data = req.body

    data.username = !data.username ? '' : data.username
    data.password = !data.password ? '' : data.password

    let userUsernameExist = ''
    let userEmailExist = ''
    try {
        userUsernameExist = await User.findAll({where: {username: data.username}})
        userEmailExist = await User.findAll({where: {email: data.username}})
    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: ""})
    }

    if (userEmailExist.length !== 0 || userUsernameExist.length !== 0) {
        const user = userEmailExist.length !== 0 
                    ? userEmailExist[0]
                    : userUsernameExist[0]
        if (user.password === data.password) {
            const authToken = getAuthToken({
                id: user.id,
                username: user.username,
                email: user.email,
                permissions: user.permissions
            })
            const message = {
                msg: "user successfully sign in",
                token: authToken,
            }
            return res.json(message)
        }
    }
    return res.status(404).json("wrong data")
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
                    const newUser = await User.create({
                        ...decToken,
                        permissions: 'default',
                    })
                    const authToken = getAuthToken({
                        id: newUser.id,
                        usename: newUser.usename,
                        email: newUser.email,
                        permissions: newUser.permissions
                    })
                    const message = {
                        msg: "user has succesfully created",
                        token: authToken,
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
            const newToken = getRegisterToken(cleanData)
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