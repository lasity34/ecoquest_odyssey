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
            
            console.log(await db.manyOrNone(query, data)); 
            return await db.manyOrNone(query, data);
        };
    };

    const getPasswordId = async ({usernameOrEmail}) => {
        const checksEmail = usernameOrEmail.includes("@");

        if (!checksEmail) {
            const data = [
                usernameOrEmail
            ];
            const filter = `where username = $1`;
            const query = `select user_id, password_hash from user_table ${filter}`;
    
            return await db.oneOrNone(query, data);
        };

        if (checksEmail) {
            const data = [
                usernameOrEmail
            ];
            const filter = `where email = $1`;
            const query = `select user_id, password_hash from user_table ${filter}`;
    
            return await db.oneOrNone(query, data);
        };
    };

    return {
        checkUser,
        getPasswordId
    };
};

export default loginUsers;