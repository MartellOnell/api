import { verifyToken } from "./jwt-sign-decode.js"

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

export const HavePermissions = async (req, res, perms, next) => {
    const data = req.body
    const token = data.token

    let decToken = ''
    try {
        decToken = verifyToken(token)
    } catch {
        return res.status(500).json({msg: "token error"})
    }

    let goesNext = false
    if (decToken !== "error, key is valid") {
        perms.map(perm => {
            if (perm === decToken.permissions) {
                next()
                goesNext = true
            }
        })
        if (!goesNext) {
            return res.status(403).json("permission denied")
        }
    } else {
        return res.status(403).json('token wasnt exists')
    }
}