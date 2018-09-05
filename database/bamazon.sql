DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Echo Dot 2nd Gen", "Electronics", 49.99, 20), ("Crazy Rich Asians", "Books", 9.69, 80), ("Bounty Paper Towels", "Home", 28.99, 150), ("AA Batteries", "HOme", 13.99, 100),("Kindle", "Electronics", 119.99, 25), ("iPad", "Electronics", 599.99, 10), ("Thermos", "Kitchen", 19.99, 50),  ("Spalding Basketball", "Sports", 29.99, 80),;



-- ### Alternative way to insert more than one row
-- INSERT INTO products (flavor, price, quantity)
-- VALUES ("vanilla", 2.50, 100), ("chocolate", 3.10, 120), ("strawberry", 3.25, 75);
