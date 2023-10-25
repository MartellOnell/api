import express from "express"
import { hello, sendMailToRegister, finalMailRegister } from "./controllers.js"

export const router = express.Router()

router.get("/", async (req, res) => {
    await hello(req, res)
})

router.post("/api/register_send_mail", async (req, res) => {
    await sendMailToRegister(req, res)
})

router.post("/api/final_register", async (req, res) => {
    await finalMailRegister(req, res)
})