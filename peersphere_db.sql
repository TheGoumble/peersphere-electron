USE peersphere_db;

-- Users
CREATE TABLE users (
    user_id        INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Groups of students
CREATE TABLE peergroups (
    group_id      INT AUTO_INCREMENT PRIMARY KEY,
    group_name    VARCHAR(150) NOT NULL,
    course_code   VARCHAR(50),
    group_code    VARCHAR(20) NOT NULL UNIQUE, -- join code
    created_by    INT NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Membership: who is in which group
CREATE TABLE memberships (
    user_id     INT NOT NULL,
    group_id    INT NOT NULL,
    is_admin    BOOLEAN DEFAULT FALSE,
    joined_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (group_id) REFERENCES peergroups(group_id)
);

-- Notes shared in a group
CREATE TABLE notes (
    note_id      INT AUTO_INCREMENT PRIMARY KEY,
    group_id     INT NOT NULL,
    author_id    INT NOT NULL,
    title        VARCHAR(200) NOT NULL,
    content      TEXT NOT NULL,
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES peergroups(group_id),
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

-- Decks of flashcards in a group
CREATE TABLE decks (
    deck_id      INT AUTO_INCREMENT PRIMARY KEY,
    group_id     INT NOT NULL,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    created_by   INT NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES peergroups(group_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Individual flashcards belonging to a deck
CREATE TABLE flashcards (
    card_id      INT AUTO_INCREMENT PRIMARY KEY,
    deck_id      INT NOT NULL,
    question     TEXT NOT NULL,
    answer       TEXT NOT NULL,
    created_by   INT NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES decks(deck_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Chat messages in a group
CREATE TABLE messages (
    message_id   INT AUTO_INCREMENT PRIMARY KEY,
    group_id     INT NOT NULL,
    author_id    INT NOT NULL,
    content      TEXT NOT NULL,
    timestamp    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES peergroups(group_id),
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

-- Calendar events for the group
CREATE TABLE calendar_events (
    event_id     INT AUTO_INCREMENT PRIMARY KEY,
    group_id     INT NOT NULL,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    start_time   DATETIME NOT NULL,
    end_time     DATETIME NOT NULL,
    created_by   INT NOT NULL,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES peergroups(group_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);