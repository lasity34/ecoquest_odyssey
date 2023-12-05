import { Router } from "express";
import db from "../model/db.js";
import loginService from "../services/login-users.js";

// validate.js module
import {login }from "../validate.js";


// Instances
const loginRouter = Router();
const LoginService = loginService(db);


// Routes

loginRouter.post("/user", async (req, res) => {
    
});

export default loginRouter;