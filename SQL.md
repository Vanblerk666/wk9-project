CREATE TABLE IF NOT EXISTS posts (
id SERIAL PRIMARY KEY,
poster_id TEXT,
posttext TEXT

);

CREATE TABLE IF NOT EXISTS profile (
id SERIAL PRIMARY KEY,
username TEXT,
clerk_id TEXT,
bio TEXT

);

CREATE TABLE IF NOT EXISTS comments (
id SERIAL PRIMARY KEY,
post_id INTEGER REFERENCES posts(id),
commenter_id INTEGER REFERENCES profile(id),
comtext TEXT
);
