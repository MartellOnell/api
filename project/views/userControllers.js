import { User } from "../database/models.js"
import { 
    getRegisterToken, 
    verifyToken, 
    getAuthToken, 
    getChangeDataToken
} from "./jwt-sign-decode.js"
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
        return res.status(500).json({msg: "db error"})
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
    return res.status(404).json({msg: "wrong data"})
}

export const sendMailChangeEmail = async (req, res) => {
    const data = req.body
    const token = data.token

    const decToken = verifyToken(token)
    try {
        const changeData = {
            method: "change email",
            oldEmail: decToken.email
        }
        const changeToken = getChangeDataToken(changeData)
        const mailMsg = {
            to: changeData.email,
            subject: "email verify",
            text: `click to change email
            http://localhost:3000/changeEmail?token=${changeToken}`
        }

        await sendMailMsg(mailMsg.to, mailMsg.subject, mailMsg.text)
        return res.json({msg: "mail has successfully sent"})

    } catch {
        return res.status(500).json({msg: "oops, an error occurred"})
    }
}

// req.body: {
//     changeToken: <changeToken from searchParams>,
//     token: <token from cookie>,
//     newEmail: <email from input on frontend>
// }
export const finalMailChange = async (req, res) => {
    try {
        const data = req.body
        const decChangeToken = verifyToken(data.changeToken)

        if (decChangeToken.method === "change email") {
            const user = await User.findAll({where: {permissions: "default", email: decChangeToken.oldEmail}})[0]
            user.email = data.newEmail
            user.save()
            const newAuthToken = getAuthToken({
                id: user.id,
                username: user.username,
                email: user.email,
                permissions: user.permissions
            })
            return res.json({msg: "successfully change email", token: newAuthToken})
        } else {
            throw Error("email not found!")
        }

    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: "oops, an error occurred"})
    }
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
                    res.status(403).json({msg: 'user already existed'})
                }
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({msg: "oops, an occured error while creating user"})
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
                msg: "mail has succesfully sent"
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
            res.status(500).json({msg: "oops, an occured error while sending email"})
        }
    } else {
        res.status(400).json({msg: "user already exists"})
    }
}

// data: {token: "<token>", checkPerms: ""}
export const checkPerms = async (req, res) => {
    const data = req.body
    const decToken = verifyToken(data.token)

    if (decToken !== "error, key is valid") {
        const state = data.checkPerms === decToken.permissions
        return res.json({msg: state})
    } else {
        return res.status(403).json({msg: "key exists"})
    }
}