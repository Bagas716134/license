DROP DATABASE license_2;

CREATE DATABASE license_2;

DROP TABLE licenses;

CREATE table licenses (
    id INT NOT NULL AUTO_INCREMENT,
    license_key VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NULL,
    expired_time TIMESTAMP NULL,
    active_time INT NULL,
    script VARCHAR(255) NULL,
    script_url VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE (license_key)
)

INSERT INTO
    licenses (
        license_key,
        start_time,
        expired_time,
        active_time,
        script,
        script_url
    )
VALUES (
        '442475d6-4f9b-4d6d-9ff5-3dee2f496fe6',
        '2024-07-08 14:57:14',
        '2024-07-20 14:57:14',
        '10',
        'growtopia',
        'zenby.com/growtopia'
    )

SELECT * FROM licenses;