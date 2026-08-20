-- Map each product name to the lowest id sharing that name
CREATE TEMPORARY TABLE product_keep AS
SELECT name, MIN(id) AS keep_id
FROM products
GROUP BY name;

-- Repoint order_items referencing a duplicate row to the kept row
UPDATE order_items oi
JOIN products p ON oi.product_id = p.id
JOIN product_keep pk ON pk.name = p.name
SET oi.product_id = pk.keep_id
WHERE oi.product_id <> pk.keep_id;

-- Drop the now-unreferenced duplicate rows
DELETE p FROM products p
JOIN product_keep pk ON pk.name = p.name
WHERE p.id <> pk.keep_id;

DROP TEMPORARY TABLE product_keep;

-- Prevent future duplicates
ALTER TABLE products ADD UNIQUE INDEX products_name_key (name);
