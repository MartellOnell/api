import { verifyToken } from "./jwt-sign-decode"

export const TokenRequired = async (req, res, next) => {
    const data = req.body
    const token = data.token

    const decToken = verifyToken(token)
    if (decToken !== "error, key is valid") {
        next()
    } else {
        return res.status(403).json('token wasnt exists')
    }
}

export const HavePermissions = async (req, res, next) => {
    const data = req.body
    const token = data.token
    const userId = data.id

    const decToken = verifyToken(token)
    if (decToken !== "error, key is valid") {
        if (decToken.id == userId) {
            next()
        } else {
            return res.status(403).json("permission denied")
        }
    } else {
        return res.status(403).json("token wasnt exists")
    }
}