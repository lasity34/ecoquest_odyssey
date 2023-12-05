import express from "express";
import { engine } from 'express-handlebars'
import dotenv from "dotenv";
import pgPromise from "pg-promise";
import session from 'express-session';


// login, signup routers
import signupRouter from "./routes/signup-route.js";
import loginRouter from "./routes/login-route.js";

// App instance
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));


app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", "./views");

dotenv.config();

const connection = {
	connectionString: process.env.ecoquest_odyssey_url,
	ssl: { rejectUnauthorized: false },
};

 
const pgp = pgPromise();

const db = pgp(connection);


// Routes middlewares
app.use("/signup", signupRouter);
app.use("/login", loginRouter);

const PORT = process.env.PORT || 3014;

app.listen(PORT, function () {
  console.log("App has started", PORT);
});
