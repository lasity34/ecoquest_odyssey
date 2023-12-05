import { Router } from "express";
import db from "../model/db.js";
import signupService from "../services/register-users.js";

// validate.js module
import {signup} from "../validate.js";

import bcrypt from "bcrypt";


// Instances
const signupRouter = Router();
const SignupService = signupService(db);


// Routes

signupRouter.post("/user", async (req, res) => {
    try {
        // Validate user req.body signup
        const { error } = signup(req.body);
        if (error) return res.json({
            error: error.details[0].message
        });

        // HASH password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        // USER object
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };

        user.name.toLowerCase();
        user.email.toLowerCase();

        // CREATE new user
        await SignupService.createUser(user);

        res.json({
            status: "Successfully registered a user"
        });

    } catch (err) {
        res.json({
            status: "Not successfully registered a user",
            error: err.stack
        })
    };
});

signupRouter.get("/users", async (req, res) => {
    try {
        const users = await SignupService.registeredUsers();

        res.json({
            status: "success",
            users: users
        });
        
    } catch (err) {
        res.json({
            status: "error",
            error: err.stack
        })
    };
});

export default signupRouter;