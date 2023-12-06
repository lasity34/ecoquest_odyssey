import express from "express";
import { engine } from 'express-handlebars'
import dotenv from "dotenv";
import pgPromise from "pg-promise";
import session from 'express-session';

// login, signup routers
import signupRouter from "./api/signup-route.js";
import loginRouter from "./api/login-route.js";
import questsRouter from "./api/quests-route.js";

// cors import
import cors from "cors";

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
	connectionString: process.env.DB_URL,
	ssl: { rejectUnauthorized: false },
};

 
const pgp = pgPromise();

const db = pgp(connection);

// Cors middleware
app.use(cors({
    origin: "*"
}));


// Routes middlewares
app.use("/api/signup", signupRouter);
app.use("/api/login", loginRouter);
app.use("/api/quests", questsRouter);

const PORT = process.env.PORT || 3014;

app.listen(PORT, function () {
  console.log("App has started", PORT);
});
