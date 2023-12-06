export default function questService(db) {
    
    async function getAllQuests() {
        let questList = await db.any("SELECT * FROM quest");
        return questList;
    }

    return {
        getAllQuests
    }
}