DROP TABLE IF EXISTS map_points CASCADE;
CREATE TABLE map_points (
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  item VARCHAR(10000) NOT NULL,
  -- longitude NUMERIC NOT NULL,
  -- latitude NUMERIC NOT NULL,
  title VARCHAR(255) NOT NULL,
  description varchar(255),
  image varchar(255)
);
