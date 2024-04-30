CREATE TABLE projects (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  client_id BIGINT,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);