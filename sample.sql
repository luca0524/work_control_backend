CREATE DATABASE sample_db;
USE sample_db;
 
CREATE TABLE notes (
    id integer PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    contents VARCHAR(255) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE bidInfos (
    id integer PRIMARY KEY AUTO_INCREMENT,
    userId VARCHAR(255) NOT NULL,
    month VARCHAR(255) NOT NULL,
    day VARCHAR(255) NOT NULL,
    week VARCHAR(255) NOT NULL,
    count integer NOT NULL DEFAULT 0
    created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO notes (title, contents)
VALUES 
('My First Note', 'A note about something'),
('My Second Note', 'A note about something else');