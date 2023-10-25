import express from "express"
import { User } from "../database/models.js"

export const hello = async (req, res) => {
    res.json("hello")
}

export const createUser = async (req, res) => {
    const data = req.body
    const cleanData = {
        username: data.username,
        email: data.email,
        password: data.email,
        phoneNumber: data.phoneNumber
    }

    const userEqEmail = await User.findAll({where: {email: data.email}})
    const userEqUsername = await User.findAll({where: {username: data.username}})
    if (userEqEmail.length == 0 && userEqUsername.length == 0) {
        try {
            const newUser = await User.create(cleanData)
            res.json("user has succesfully created")
        } catch {
            res.status(500).json("oops an occured error while creating user")
        }
    } else {
        res.status(400).json("user already exists")
    }
}