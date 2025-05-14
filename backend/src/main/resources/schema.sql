CREATE TABLE eelarved (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          total_amount NUMERIC(10, 2) NOT NULL,
                          shared BOOLEAN NOT NULL DEFAULT FALSE,
                          start_date DATE,
                          end_date DATE,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eelarve_liikmed (
                                 id SERIAL PRIMARY KEY,
                                 budget_id BIGINT NOT NULL REFERENCES eelarved(id) ON DELETE CASCADE,
                                 user_id BIGINT NOT NULL REFERENCES kasutajad(id) ON DELETE CASCADE
);

CREATE TABLE eelarve_kategooriad (
                                     id SERIAL PRIMARY KEY,
                                     budget_id BIGINT NOT NULL REFERENCES eelarved(id) ON DELETE CASCADE,
                                     category_id BIGINT NOT NULL REFERENCES kategooriad(id) ON DELETE CASCADE
);