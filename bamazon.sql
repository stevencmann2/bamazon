-- Create DB bamazon
DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;
-- Create table of products 

CREATE TABLE products(
item_id INTEGER AUTO_INCREMENT NOT NULL,
product_name VARCHAR (100) NOT NULL,
department_name VARCHAR (100) NOT NULL,
price DECIMAL (13, 2) NOT NULL,
stock_quantity INTEGER,
PRIMARY KEY (item_id)
);

-- 10 'mock' products

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Life Savers Mints", "Food & Grocery", 13.98, 45)
, ("All My Friends Are Dead", "Books and Audible", 8.09, 19)
, ("Titleist Pro V1 Golf Balls (One Dozen)", "Sports and Outdoors", 39.98, 200)
, ("Pet Zone IQ Treat Ball", "Pet Supplies", 12.45, 9)
, ("TOGUARD Mini Dash Cam", "Automotive and Industrial", 39.99, 22)
, ("HUGGIES Little Movers Slip On Diaper Pants, Size 6", "Toys, Kids, and Baby", 37.96, 47)
, ("Echo Dot (3rd Gen) - Smart speaker with Alexa - Charcoal", "Smart Home", 24.99, 66)
, ("Rivet HygroCotton Hand Towel Set - Pack of 2, Ocean", "Beauty and Health", 19.99, 2)
, ("Led Zeppelin - The Song Remains the Same - Blu-ray", "Movies, Music and Games", 10.50, 13)
, ("Amazon.com eGift Card", "Gift Cards", 50.00, 1);





SELECT * FROM products;

