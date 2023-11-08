import { Op } from 'sequelize'
import { User } from '../database/models.js'


export const createAdmin = async (req, res) => {
    const data = req.body

    data.username = !data.username ? "" : data.username
    data.email = !data.email ? "" : data.email
    data.password = !data.password ? "" : data.password
    data.phoneNumber = !data.phoneNumber ? "" : data.phoneNumber

    let UserEqEmail = []
    try {
        const UserEqEmail = await User.findAll({where: {email: data.email}})
    } catch {
        return res.status(500).json({msg: "db error"})
    }

    if (UserEqEmail.length !== 0) {
        try {
            const userData = {
                username: data.username,
                phoneNumber: data.phoneNumber,
                email: data.email,
                password: data.password,
                permissions: "admin"
            }

            await User.create(userData)
            
            return res.json({msg: "user successfully created"})
        } catch {
            return res.status(500).json({msg: "oops, an error occurred"})
        }
    } else {
        return res.status(403).json({msg: "this user alredy exists"})
    }
}

export const getAdminsList = async (req, res) => {
    try {
        let users = await User.findAll({where: {permissions: "admin"}})
        return res.json({msg: 'successful', data: users})
    } catch {
        return res.status(500).json({msg: "oops, an error occurred"})
    }
}

export const getUsersList = async (req, res) => {
    try {
        let users = await User.findAll({where: {permissions: "default"}})
        return res.json({msg: "successful", data: users})
    } catch {
        return res.status(500).json({msg: "oops, an error occurred"})
    }
}

export const editAdmin = async (req, res) => {
    const newData = req.body.new
    const data = req.body.old

    let user = ''
    try {
        user = User.findAll({where: {username: data.username}})[0]
        user.username = newData.username
        user.password = newData.password
        user.email = newData.email
        user.phoneNumber = newData.phoneNumber
        user.save()
    } catch {
        return res.status(500).json({msg: "oops, an error occurred"})
    }
}

export const getUsersByUsernameOrEmail = async (req, res) => {
    const data = req.body
    if (data.username) {
        try {
            const whereForUsername = {
                username: {
                    [Op.like]: `%${data.username}%`
                },
                permissions: "default"
            }

            const whereForEmail = {
                email: {
                    [Op.like]: `%${data.username}%`
                },
                permissions: "default"
            }

            const usersEmail = await User.findAll({where: whereForEmail})
            const usersUsername = await User.findAll({where: whereForUsername})
            const users = usersEmail.concat(usersUsername)

            return res.json({
                msg: "successfully get data", 
                data: users
            })
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                msg: "oops, an error occurred"
            })
        }
    } else {
        return res.status(404).json({msg: "empty data"})
    }
}

export const getAdminsByUsernameOrEmail = async (req, res) => {
    const data = req.body
    if (data.username) {
        try {
            const whereForUsername = {
                username: {
                    [Op.like]: `%${data.username}%`
                },
                permissions: "admin"
            }

            const whereForEmail = {
                email: {
                    [Op.like]: `%${data.username}%`
                },
                permissions: "admin"
            }

            const usersEmail = await User.findAll({where: whereForEmail})
            const usersUsername = await User.findAll({where: whereForUsername})
            const users = usersEmail.concat(usersUsername)

            return res.json({
                msg: "successfully get data", 
                data: users
            })

        } catch (err) {
            console.log(err)
            return res.status(500).json({
                msg: "oops, an error occurred"
            })
        }
    } else {
        return res.status(404).json({msg: "empty data"})
    }
}