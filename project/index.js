import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { router } from "./views/router.js"
import { sequelize } from "./database/db.js"
import busboy from "connect-busboy"
import fs from 'fs'
dotenv.config({ path: './.env' })

const port = process.env.NODE_PORT
let app = express()

try {
    await sequelize.authenticate()
    await sequelize.sync()
} catch(e) {
    console.log(e)
}

app.use(cors({
    origin: '*',
}))
app.use(busboy)
app.use(express.json())
app.use(router)
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})