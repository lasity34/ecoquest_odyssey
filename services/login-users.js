const loginUsers = (db) => {
    const checkUser = async ({usernameOrEmail}) => {
        const checksEmail = usernameOrEmail.includes("@");

        if (!checksEmail) {
            const data = [
                usernameOrEmail
            ];
            const filter = `where username = $1`;
            const query = `select * from user_table ${filter}`;
            
            return await db.manyOrNone(query, data);
        };

        if (checksEmail) {
            const data = [
                usernameOrEmail
            ];
            const filter = `where email = $1`;
            const query = `select * from user_table ${filter}`;

            return await db.manyOrNone(query, data);
        };
    };

    return {
        checkUser,
    };
};

export default loginUsers;