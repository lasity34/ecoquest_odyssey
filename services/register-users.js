const registerUsers = (db) => {

    const registeredUsers = async () => {
        return await db.manyOrNone("select * from user_table");
    };

    const createUser = async ({name, email, password}) => {
        const data = [
            name,
            email,
            password
        ];

        
        const values = `values ($1, $2, $3)`;
        const query = `insert into user_table (username, email, password_hash) ${values}`;

        await db.none(query, data);
    };

    return {
        createUser,
        registeredUsers
    };
};

export default registerUsers;