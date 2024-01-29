import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import busboy from "connect-busboy"
import { router } from "./views/router.js"
import { sequelize } from "./database/db.js"
dotenv.config({ path: './.env' })

const port = process.env.NODE_PORT
let app = express()

try {
    await sequelize.authenticate()
    await sequelize.sync()
} catch (e) {
    console.log(e)
}

app.use(busboy({ immediate: true }))
app.use(cors({
    origin: '*',
}))
app.use(express.json())
app.use(router)
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})