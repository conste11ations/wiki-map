-- Drop and recreate Users table (Example)

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  city varchar(255) NOT NULL,
  profile_image varchar(255) DEFAULT '',
  password varchar(255) NOT NULL
);
