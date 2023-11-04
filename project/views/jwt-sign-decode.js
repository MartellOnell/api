import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import crypto from "crypto"
dotenv.config()

const privateKey = process.env.SECRET_KEY 
const initialVector = process.env.SECRET_VECTOR
const secKey = Buffer.from(privateKey, 'utf8')
const inVector = Buffer.from(initialVector, 'utf8')
const algo = process.env.ENC_ALGORITHMS
const jwtSecKey = privateKey


const encryptToken = token => {
    const cipher = crypto.createCipheriv(algo, secKey, inVector)
    let encData = cipher.update(token, "utf-8", "hex")
    encData += cipher.final("hex")
    return encData
}

const decryptToken = encryptToken => {
    const decipher = crypto.createDecipheriv(algo, secKey, inVector)
    let decData = decipher.update(encryptToken, "hex", "utf-8")
    decData += decipher.final("utf8")
    return decData
}

export const getRegisterToken = data => {
    const token = jwt.sign(data, jwtSecKey, { expiresIn: '1d' })
    return encryptToken(token)
}

export const getAuthToken = data => {
    const token = jwt.sign(data, jwtSecKey, {expiresIn: '15d' })
    return encryptToken(token)
}

export const verifyToken = token => {
    try {
        const decData = decryptToken(token)
        const decToken = jwt.verify(decData, jwtSecKey)
        delete decToken['iat']
        delete decToken['exp']
        return decToken
    } catch (err) {
        console.log(err)
        return "error, key is valid"
    }
}
