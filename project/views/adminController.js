import { Op } from 'sequelize'
import { User, Product } from '../database/models.js'
import { readCsv } from '../csv_reader/csvRead.js';
import * as fs from "fs"
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pathToSaveCsv = __dirname.slice(0, __dirname.length - 6) + 'csvMedia/'

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
        const limitAtributes = {
            limit: 10,
            offset: parseInt(data.offset)
        }

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

        const {count : countEmail, rows : usersEmail} = await User.findAndCountAll({
            where: whereForEmail,
            limit: limitAtributes.limit,
            offset: limitAtributes.offset
        })
        const {count : countUsername, rows : usersUsername} = await User.findAndCountAll({
            where: whereForUsername,
            limit: limitAtributes.limit,
            offset: limitAtributes.offset
        })
        const users = {username: usersUsername, email: usersEmail}

        return res.json({
            msg: "successfully get data",
            data: users,
            counter: Math.max(countEmail, countUsername)
        })
    } else {
        return res.status(404).json({msg: "empty data"})
    }
}

export const getAdminsByUsernameOrEmail = async (req, res) => {
    const data = req.body
    if (data.username) {
        try {
            const limitAtributes = {
                limit: 10,
                offset: parseInt(data.offset)
            }

            const whereForUsername = {
                username: {
                    [Op.like]: `%${data.username}%`
                },
                permissions: "admin",
            }

            const whereForEmail = {
                email: {
                    [Op.like]: `%${data.username}%`
                },
                permissions: "admin"
            }

            const {count : countEmail, rows : usersEmail} = await User.findAndCountAll({where: whereForEmail}, ...limitAtributes)
            const {count : countUsername, rows : usersUsername} = await User.findAndCountAll({where: whereForUsername}, ...limitAtributes)
            const users = {username: usersUsername, email: usersEmail}

            return res.json({
                msg: "successfully get data", 
                data: users,
                counter: Math.max(countEmail, countUsername)
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

export const uploadProductsAsFile = async (req, res) => {
    const newFileName = "data" + (Math.random() * 100000).toString() + ".csv"
    if (req.busboy) {
        req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            file.pipe(fs.createWriteStream(pathToSaveCsv + newFileName))
            console.log('upload file ' + newFileName)
        })
        req.busboy.on('finish', () => {
            readCsv(pathToSaveCsv + newFileName, (data) => {
                Product.create(data)
            }, () => {
                fs.unlinkSync(pathToSaveCsv + newFileName)
            })
        })

        return res.json({msg: "successfully uploaded"})
    } else {
        return res.status(400).json('wrong data')
    }
}

export const getAllUsersByOffset = async (req, res) => {
    const data = req.body
    const offset = data.offset

    const {count, rows : users} = await User.findAndCountAll({
        where: {
            permissions: "default"
        },
        limit: 10,
        offset: parseInt(offset),
    })

    return res.json({msg: "successfully get users", data: users, counter: count})
}

export const createProduct = async (req, res) => {
    const data = req.body
    const cleanData = {
        name: data.name,
        nomenclature: data.nomenclature,
        manufacturer: data.manufacturer,
        coast: data.coast,
        category: data.category,
        subcategory: data.subcategory,
        tip: data.tip,
    }
    if (data.color) cleanData.color = data.color;
    if (data.vendorCode) cleanData.vendorCode = data.vendorCode;

    Product.create(cleanData)
        .then(res => {
            return res.json({msg: "successfully created"})
        })
        .catch(err => {
            return res.status(500).json("oops, an error occured while creating Product")
        })
}

export const editProduct = async (req, res) => {
    const data = req.body
    const cleanData = {
        name: data.name,
        nomenclature: data.nomenclature,
        manufacturer: data.manufacturer,
        coast: data.coast,
        category: data.category,
        subcategory: data.subcategory,
        tip: data.tip,
    }
    if (data.color) cleanData.color = data.color;
    if (data.vendorCode) cleanData.vendorCode = data.vendorCode;
}