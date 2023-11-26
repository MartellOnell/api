import express from "express"
import { sendMailToRegister, finalMailRegister, login, checkPerms } from "./userControllers.js"
import {HavePermissions, TokenRequired} from "./decorators.js"
import {
    createAdmin, createProduct, editAdmin, editProduct, editUser,
    getAdminsByUsernameOrEmail,
    getAllUsersByOffset, getCurrentAdminById, getCurrentUserById,
    getUsersByUsernameOrEmail,
    uploadProductsAsFile,
} from "./adminController.js"
import {getProductsByOffset} from "./productControllers.js";

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

router.post("/api/admin/uploadProductsByCsv",async (req, res, next) => {
    await HavePermissions(req, res, ["admin", "platform admin"], next)
}, async (req, res) => {
    await uploadProductsAsFile(req, res)
})

router.post("/api/checkPerms", async (req, res) => {
    await checkPerms(req, res)
})

router.post("/api/admin/getAllUsersOffset", async (req, res, next) => {
    await HavePermissions(req, res, ["admin", "platform admin"], next)
}, async (req, res) => {
    await getAllUsersByOffset(req, res)
})

router.post("/api/admin/getCurrentUserById", async (req, res, next) => {
    await HavePermissions(req, res, ["admin", "platform admin"], next)
}, async (req, res) => {
    await getCurrentUserById(req, res)
})

router.post("/api/admin/getCurrentAdminById", async (req, res, next) => {
    await HavePermissions(req, res, ["platform admin"], next)
}, async (req, res) => {
    await getCurrentAdminById(req, res)
})

router.post("/api/admin/editUser", async (req, res, next) => {
    await HavePermissions(req, res, ["admin", "platform admin"], next)
}, async (req, res) => {
    await editUser(req, res)
})

router.post("/api/admin/editAdmin", async (req, res, next) => {
    await HavePermissions(req, res, ["platform admin"], next)
}, async (req, res) => {
    await editAdmin(req, res)
})

router.post("/api/admin/uploadProduct", async (req, res, next) => {
    await HavePermissions(req, res, ["admin", "platform admin"], next)
}, async (req, res) => {
    await createProduct(req, res)
})

router.post("/api/admin/editProduct", async (req, res, next) => {
    await HavePermissions(req, res, ["admin", "platform admin"], next)
}, async (req, res) => {
    await editProduct(req, res)
})

router.post("/api/products/getProductsByOffset", async (req, res, next) => {
    await TokenRequired(req, res, next)
}, async (req, res) => {
    await getProductsByOffset(req, res)
})