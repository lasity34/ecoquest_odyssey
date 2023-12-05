const registerUsers = (db) => {

    const registeredUsers = async () => {
        return await db.manyOrNone();
    };

    const createUser = async ({name, email, password}) => {
        const data = [
            name,
            email,
            password
        ];

        
        await db.none();
    };

    return {
        createUser,
        registeredUsers
    };
};

export default registerUsers;