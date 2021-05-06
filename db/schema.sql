DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;
DROP TABLE IF EXISTS voters;
-- candidates table must be dropped before the parties table due to 
-- the foreign key constraint that requires the parties table to exist.

CREATE TABLE parties (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE candidates (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  party_id INTEGER,
  industry_connected BOOLEAN NOT NULL,
  CONSTRAINT fk_party FOREIGN KEY (party_id) References parties(id) ON DELETE SET NULL
);
-- party_id field is official foreign key. References parties(id).
-- B/c the constraint relies on parties table, parties is defined 1st.
-- ON DELETE of parties(id) set party_id to NULL

-- A foreign key is a field in one table that references the primary key of another table. 
-- In this case, Ronald Firbank's row in candidates would include a 
-- field with the number 1, but we'd know that that refers to a row 
-- in the parties table with the same id value. Take a look at 
-- the following image to better understand the relationship:

-- ALTER TABLE: 
-- add new field, delete field, modify field 
  -- 1. ALTER TABLE candidates ADD COLUMN party_id INTEGER;
    -- Preps candidate table with foreign key
  -- 2. DROP TABLE IF EXISTS candidates;

  CREATE TABLE voters (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    -- In SQL, a DATETIME field's value will look something like 2020-01-01 13:00:00.
    -- Front-end can convert format with date() later on. 
    -- DEFAULT prevents a NULL result when input is left blank.
    -- CURRENT_TIMESTAMP is the value of DEFAULT (server time)
  );