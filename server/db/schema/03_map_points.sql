DROP TABLE IF EXISTS map_points CASCADE;
CREATE TABLE map_points (
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  layers VARCHAR(400) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description varchar(255),
  image varchar(255),
  website varchar(255)
);
