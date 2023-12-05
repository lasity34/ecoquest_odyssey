import pgPromise from "pg-promise";
import 'dotenv/config';

const connectionString = process.env.DB_URL;

const database = pgPromise()(connectionString);
database.connect();

export default database;