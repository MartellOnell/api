import express from "express"
import { sendMailToRegister, finalMailRegister, login } from "./userControllers.js"
import { HavePermissions } from "./decorators.js"
import { 
    createAdmin, 
    getAdminsByUsernameOrEmail, 
    getUsersByUsernameOrEmail,
    uploadProductsAsFile,
} from "./adminController.js"

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

router.post("/api/admin/register", async (req, res, next) => {
    await HavePermissions(req, res, ["platform admin"], next)
}, async (req, res) => {
    await createAdmin(req, res)
})

router.post("/api/admin/getUsers", async (req, res, next) => {
    await HavePermissions(req, res, ["platform admin", "admin"], next)
}, async (req, res) => {
    await getUsersByUsernameOrEmail(req, res)
})

router.post("/api/admin/getAdmins", async (req, res, next) => {
    await HavePermissions(req, res, ["platform admin"], next)
}, async (req, res) => {
    await getAdminsByUsernameOrEmail(req, res)
})

router.post("/api/admin/test", async (req, res) => {
    await uploadProductsAsFile(req, res)
})