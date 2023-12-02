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

    let user = ''
    try {
        user = await User.findAll({
            where: {
                id: newData.id,
                permissions: "admin"
            }
        })
        user = user[0]
        user.username = newData.username
        user.password = newData.password
        user.email = newData.email
        user.phoneNumber = newData.phoneNumber
        user.save()

        return res.json({
            msg: "successfully reedit admin",
            newData: user
        })
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
        .then(result => {
            return res.json({
                msg: "successfully created",
                id: result.id,
            })
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

    const product = await Product.findOne({
        where: {
            nomenclature: cleanData.nomenclature
        },
    })

    product.name = cleanData.name
    product.nomenclature = cleanData.nomenclature
    product.manufacturer = cleanData.manufacturer
    product.coast = cleanData.coast
    product.category = cleanData.category
    product.subcategory = cleanData.subcategory
    product.tip = cleanData.tip
    if (cleanData.color) product.color = cleanData.color
    if (cleanData.vendorCode) product.vendorCode = cleanData.vendorCode
    product.save()

    return res.json({
        msg: "data successfully reedit product",
        data: product
    })
}

export const editUser = async (req, res) => {
    const newData = req.body.new

    let user = ''
    try {
        user = await User.findAll({
            where: {
                id: newData.id,
                permissions: "default"
            }
        })
        user = user[0]
        user.username = newData.username
        user.password = newData.password
        user.email = newData.email
        user.phoneNumber = newData.phoneNumber
        user.save()

        return res.json({
            msg: "successfully reedit user"
        })
    } catch {
        return res.status(500).json({msg: "oops, an error occurred"})
    }
}

export const getCurrentUserById = async (req, res) => {
    const data = req.body
    if (data.id != undefined) {
        const user = await User.findOne({
            where: {
                id: data.id,
                permissions: "default"
            }
        })
        if (user != undefined) {
            return res.json({
                msg: "successfully found user",
                data: user
            })
        }
    }
    return res.status(404).json({
        msg: "this user doesn't exists"
    })
}

export const getCurrentAdminById = async (req, res) => {
    const data = req.body
    if (data.id != undefined) {
        const user = await User.findOne({
            where: {
                id: data.id,
                permissions: "admin"
            }
        })
        if (user != undefined) {
            return res.json({
                msg: "successfully found user",
                data: user
            })
        }
    }
    return res.status(404).json({
        msg: "this user doesn't exists"
    })
}

export const getAllAdmins = async (req, res) => {
    const admins = await User.findAll({
        where: {
            permissions: "admin",
        }
    })

    return res.json({
        msg: "successfully get users",
        data: admins,
    })
}

export const getProductsByOffsetAdmin = async (req, res) => {
    const data = req.body

    const products = await Product.findAndCountAll({
        where: {
          [Op.or]: {
              name: {[Op.like]: `%${data.arg}%` },
              nomenclature: {[Op.like]: `%${data.arg}%` }
          }
        },
        limit: 10,
        offset: data.offset
    })

    return res.json({
        msg: "successfully get products",
        data: products.rows,
        counter: products.count
    })
}

export const getProductById = async (req, res) => {
    const data = req.body

    const product = await Product.findOne({
        where: {
            id: data.id
        }
    })

    return res.json({
        msg: 'successfully get product',
        data: product
    })
}