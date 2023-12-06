export default function questService(db) {

    async function getAllQuests() {
        let questList = await db.any("SELECT * FROM quest");
        return questList;
    }

    async function getAllQuestItems() {
        let questItemsList = await db.any("SELECT * FROM quest_item");
        return questItemsList;
    }

    return {
        getAllQuests,
        getAllQuestItems
    }
}