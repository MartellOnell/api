import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { router } from "./views/router.js"
//import { sequelize } from ""
dotenv.config()

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}
const port = process.env.NODE_PORT
let app = express()

// try {
//     await sequelize.authenticate()
//     await sequelize.sync()
// } catch(e) {
//     console.log(e)
// }

app.use(cors(corsOptions))
app.use(express.json())
app.use(router)
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})