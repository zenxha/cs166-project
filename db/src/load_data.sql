/* Replace the location to where you saved the data files*/
COPY Users
FROM '/data/users.csv'
WITH DELIMITER ',' CSV HEADER;

COPY Items
FROM '/data/items.csv'
WITH DELIMITER ',' CSV HEADER;

COPY Store
FROM '/data/store.csv'
WITH DELIMITER ',' CSV HEADER;

COPY FoodOrder
FROM '/data/foodorder.csv'
WITH DELIMITER ',' CSV HEADER;

COPY ItemsInOrder
FROM '/data/itemsinorder.csv'
WITH DELIMITER ',' CSV HEADER;
