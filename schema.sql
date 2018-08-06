DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(250) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price FLOAT(10, 2) NOT NULL,
stock_quantity INTEGER(10) NOT NULL,
product_sales FLOAT(10, 2) NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO 
	products (product_name, department_name, price, stock_quantity, product_sales)
VALUES 
	("Apple 13.3in MacBook Air ( Silver)", "Electronics", 959.99, 100, 0),
	("Canon EOS Rebel T6 Digital SLR Camera", "Electronics", 399.00, 100, 0),
	("Beats Solo3 by Dr. Dre Wireless On-Ear Headphones", "Electronics", 197.00, 100, 0),
	("Fujifilm Instax Mini 8 Instant Film Camera", "Electronics", 84.99, 100, 0),
	("Echo Dot Smart speaker with Alexa", "Electronics", 49.99, 100, 0),
	("Portable Charger RAVPower 16750mAh", "Accessories", 33.99, 100, 0),
	("WALI Free-Standing Dual LCD Monitor Desk Mount", "Accessories", 31.45, 100, 0),
	("Samsonite Laptop Business Backpack", "Accessories", 135.70, 100, 0),
	("MacBook Air 13.3in Hard Case With Keyboard Cover", "Accessories", 18.99, 100, 0),
	("Microsoft Office Home and Business 2016", "Software", 209.00, 100, 0),
  	("Adobe Creative Cloud (1 Year Subscription)", "Software", 599.88, 100, 0);
 
SELECT * FROM products;
   
CREATE TABLE departments (
department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
department_name VARCHAR(100) NOT NULL,
overhead_costs FLOAT(10, 2) NOT NULL,
PRIMARY KEY (department_id)
);

INSERT INTO 
	departments (department_name, overhead_costs)
VALUES
  ("Accessories", 5000),
  ("Electronics", 10000),
  ("Software", 200);

SELECT * FROM departments;
