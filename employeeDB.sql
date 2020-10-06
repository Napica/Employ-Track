DROP DATABASE IF EXISTS employee_db;
CREATE database employee_db;
USE employee_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL, 
  PRIMARY KEY (id)
);

-- INSERT INTO department (name)
-- VALUES ("Management"), ("IT department"),("Customer Service");

-- SELECT * FROM department; 

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT, 
    title VARCHAR (30), 
    salary DECIMAL (10,4),
    department_id INT,
    PRIMARY KEY (id)
);

-- INSERT INTO role (title, salary, department_id)
-- VALUES ("Manager", 50000, 1), ("IT department", 45000, 2),("Intern", 35000, 3);

-- SELECT * FROM role;

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR (30) NOT NULL, 
    last_name VARCHAR (30) NOT NULL, 
    role_id INT,
    department_id INT,
    manager_id INT, 
    PRIMARY KEY (id)
);

-- INSERT INTO employee (first_name, last_name, role_id, department_id)
-- VALUES ("Tommy", "Bahama", 1, 1), ("Valerie", "Vice", 2, 2),("Sarah", "Smart", 3, 3);

-- SELECT * FROM employee; 

-- SELECT first_name, last_name, title, salary, name
-- FROM employee
-- INNER JOIN role ON employee.role_id = role.id
-- INNER JOIN department on employee.department_id = department.id