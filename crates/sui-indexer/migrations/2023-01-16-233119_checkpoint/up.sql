CREATE TABLE checkpoints (
    sequence_number BIGINT PRIMARY KEY,
    content_digest VARCHAR(255) NOT NULL,
    epoch BIGINT NOT NULL,
    -- derived from gas cost summary
    total_gas_cost BIGINT NOT NULL,
    total_computation_cost BIGINT NOT NULL,
    total_storage_cost BIGINT NOT NULL,
    total_storage_rebate BIGINT NOT NULL,
    total_transactions BIGINT NOT NULL,
    total_transactions_current_epoch BIGINT NOT NULL,
    total_transactions_from_genesis BIGINT NOT NULL,
    previous_digest VARCHAR(255),
    next_epoch_committee TEXT,
    -- number of milliseconds from the Unix epoch
    timestamp_ms BIGINT NOT NULL,
    timestamp_ms_str TIMESTAMP NOT NULL,
    checkpoint_tps REAL NOT NULL,
    UNIQUE(sequence_number) 
);

CREATE INDEX checkpoints_content_digest ON checkpoints (content_digest);
CREATE INDEX checkpoints_epoch ON checkpoints (epoch);

CREATE TABLE checkpoint_logs (
    next_cursor_sequence_number BIGINT PRIMARY KEY
);

INSERT INTO checkpoint_logs (next_cursor_sequence_number) VALUES (0);
