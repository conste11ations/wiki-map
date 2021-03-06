DROP TABLE IF EXISTS maps CASCADE;
CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  city varchar(255) NOT NULL,
  category varchar(255) NOT NULL,
  center_lat NUMERIC default 51.505,
  center_long NUMERIC default -0.09
);
