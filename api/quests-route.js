import express from "express";
import db from "../model/db.js";
import questService from "../services/quests-service.js";

const router = express.Router();

const questServiceInstance = questService(db)

router.get("/", async (req, res) => {
    try {
        let questList = await questServiceInstance.getAllQuests() ;
        res.status(200).json(questList);
    } catch (error) {
        console.log(error);
    }
} );


export default router;