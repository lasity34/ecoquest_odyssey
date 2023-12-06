CREATE TABLE user_table (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);
CREATE TABLE quest(
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    ecosystem_type VARCHAR(50),
);

CREATE TABLE quest_item (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    quest_id INT,
    FOREIGN KEY (quest_id) REFERENCES quest(id)
);

CREATE TABLE user_quest (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_table(user_id),
    quest_id INTEGER REFERENCES quests(quest_id),
    progress_status VARCHAR(50) NOT NULL,
    completion_date TIMESTAMP WITH TIME ZONE
);

