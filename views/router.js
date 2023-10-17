import express from "express"
import { hello } from "./controllers.js"
export const router = express.Router()
router.get("/", async (req, res) => {
    await hello(req, res)
})