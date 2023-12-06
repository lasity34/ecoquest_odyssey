import { Router } from "express";
import db from "../model/db.js";
import loginService from "../services/login-users.js";

// validate.js module
import {login }from "../validate.js";

// Bcrypt import
import bcrypt from "bcrypt";

// JWT import
import jwt from "jsonwebtoken";

// Instances
const loginRouter = Router();
const LoginService = loginService(db);


// Routes

loginRouter.post("/user", async (req, res) => {
    // Validate user req.body signup
    const { error } = login(req.body);
    if (error) return res.json({
        error: error.details[0].message
    });

    // USER object
    const user = {
        usernameOrEmail: req.body.usernameOrEmail,
        password: req.body.password
    }; 

    user.usernameOrEmail.toLowerCase()

    // Checks registered users
    const getUser = await LoginService.checkUser(user);

    if (getUser.length === 0) return res.json({
        status: "error",
        error: "Not registered in the signup page."
    })

    const passwordId = await LoginService.getPasswordId(user);
    const validPassword = await bcrypt.compare(user.password, passwordId.password_hash);

    if (!validPassword) return res.json({
        status: "error",
        error: "Invalid password."
    });

    const token = jwt.sign({
        name: user.name
    }, process.env.TOKEN, { expiresIn: '1h' });

    res.header("authorization", token).status(200).json({
        status: "Logged in...",
        token: token,
        loggedUserId: passwordId.user_id
    });
});

export default loginRouter;