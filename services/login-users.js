const loginUsers = (db) => {
    const checkUser = async ({name, email, password}) => {

        if (name) {
            const data = [
                name,
                password
            ];
            const filter = `where username = $1 and password_hash = $2`;
            const query = `select * from user_table ${filter}`;
    
            return await db.manyOrNone(query, data);
        };

        if (email) {
            const data = [
                email,
                password
            ];
            const filter = `where email = $1 and password_hash = $2`;
            const query = `select * from user_table ${filter}`;
    
            return await db.manyOrNone(query, data);
        };
    };

    const getPassword = async ({name, email, password}) => {
        if (name) {
            const data = [
                name
            ];
            const filter = `where username = $1`;
            const query = `select password_hash from user_table ${filter}`;
    
            return await db.oneOrNone(query, data);
        };

        if (email) {
            const data = [
                email
            ];
            const filter = `where email = $1`;
            const query = `select password_hash from user_table ${filter}`;
    
            return await db.oneOrNone(query, data);
        };
    };

    return {
        checkUser,
        getPassword
    };
};

export default loginUsers;