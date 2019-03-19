BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('Jessie', 'jessie@gmail.com', 5, '2018-01-01')
INSERT into login (hash, email) values ('e1671797c52e15f763380b45e841ec32', 'jessie@gmail.com')

COMMIT;
