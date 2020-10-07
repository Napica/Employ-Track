DROP DATABASE IF EXISTS employee_db;
CREATE database employee_db;
USE employee_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL, 
  PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT, 
    title VARCHAR (30), 
    salary DECIMAL (10,4),
    departments_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR (30) NOT NULL, 
    last_name VARCHAR (30) NOT NULL, 
    role_id INT,
    departments_id INT,
    manager_id INT, 
    PRIMARY KEY (id)
);