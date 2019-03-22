BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('a', 'a@a.com', 5, '2018-01-01');
INSERT into login (hash, email) values ('0cc175b9c0f1b6a831c399e269772661', 'a@a.com');

COMMIT;
