import express from "express"
import { sendMailToRegister, finalMailRegister, login } from "./userControllers.js"

export const router = express.Router()

router.post("/api/login", async (req, res) => {
    await login(req, res)
})

router.post("/api/register_send_mail", async (req, res) => {
    await sendMailToRegister(req, res)
})

router.post("/api/register", async (req, res) => {
    await login(req, res)
})

router.post("/api/final_register", async (req, res) => {
    await finalMailRegister(req, res)
})

router.get("/api/test/:token", async (req, res) => {
    const getToken = req.params.token
    if (token == getToken) {
        res.json('url wasnt cutting url route')
    } else {
        res.json('url token was cutted')
    }
})