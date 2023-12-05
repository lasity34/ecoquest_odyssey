import { Router } from "express";
import db from "../model/db.js";
import loginService from "../services/login-users.js";

// validate.js module
import {login }from "../validate.js";

// Bcrypt import
import bcrypt from "bcrypt";

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
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }; 

    if (user.name) {
        user.name.toLowerCase();

    } else {
        user.email.toLowerCase();
    };

    // Checks registered users
    const getUser = await LoginService.checkUser(user);

    if (!getUser) return res.json({
        status: "error",
        error: "Not registered in the signup page."
    })

    const password = await LoginService.getPassword(user);
    const validPassword = await bcrypt.compare(user.password, password.password_hash);

    if (!validPassword) return res.json({
        status: "error",
        error: "Invalid password."
    });

    res.json({
        status: "Logged in..."
    });
});

export default loginRouter;