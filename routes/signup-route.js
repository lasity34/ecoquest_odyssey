import { Router } from "express";
import db from "../model/db.js";
import signupService from "../services/register-users.js";

// validate.js module
import validate from "../validate.js";


// Instances
const signupRouter = Router();
const SignupService = signupService(db);


// Routes
signupRouter.get("/", async (req, res) => {

});

signupRouter.post("/user", async (req, res) => {
    
});

export default signupRouter;