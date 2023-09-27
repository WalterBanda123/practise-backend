
CREATE TABLE tasks(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(300),
    description TEXT NOT NULL,
    createdOn DATE NOT NULL,
    completed BOOLEAN DEFAULT 'false',
    owner BIGINT NOT NULL REFERENCES users(id)
);