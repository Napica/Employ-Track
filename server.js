const mysql = require("mysql");
const inquirer = require("inquirer");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "shepard1",
  database: "employee_db",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId + "\n");
  startFunction();
  //   connection.end();
});

function startFunction() {
  inquirer
    .prompt({
      name: "start",
      message: "What would you like to do?",
      type: "list",
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Role",
        "Add Employee",
        "Add Department",
        "Add Role",
        "EXIT",
      ],
    })
    .then(function (answer) {
      if (answer.start === "View All Employees") {
        viewAllEmployees();
      } else if (answer.start === "View All Employees by Department") {
        viewEmployeesByDepartment();
      } else if (answer.start === "View All Employees by Role") {
        viewEmployeesByRole();
      } else if (answer.start === "Add Employee") {
        addEmployee();
      } else if (answer.start === "Add Department") {
        addDepartment();
      } else if (answer.start === "Add Role") {
        addRole();
      } else if (answer.start === "EXIT") {
        connection.end();
      }
    });
}

// function to view all employees
function viewAllEmployees() {
  connection.query(
    "SELECT first_name, last_name, title, salary, name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN departments ON role.departments_id = departments.id;",
    (err, data) => {
      if (err) throw err;
      console.table(data);
      startFunction();
    }
  );
}

// Function to view employees by department
function viewEmployeesByDepartment() {
  connection.query("SELECT name FROM departments", (err, data) => {
    if (err) throw err;
    const departmentSelection = [];
    for (let i = 0; i < data.length; i++) {
      departmentSelection.push(data[i]);
    }
    inquirer
      .prompt({
        name: "selection",
        type: "list",
        message: "Please select a department: ",
        choices: departmentSelection,
      })
      .then(({ selection }) => {
        connection.query(
          "SELECT first_name, last_name, role.title, departments.name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN departments ON role.departments_id=departments.id WHERE departments.name = ?;",
          [selection],
          (err, res) => {
            if (err) throw err;
            console.table(res);
            startFunction();
          }
        );
      });
  });
}

// Function to view employee by role

function viewEmployeesByRole() {
  connection.query("SELECT title, id FROM role", (err, data) => {
    if (err) throw err;
    const roleSelection = [];
    for (let i = 0; i < data.length; i++) {
      roleSelection.push(data[i].title);
    }
    inquirer
      .prompt({
        name: "roleSelect",
        type: "list",
        message: "Please select a role",
        choices: roleSelection,
      })
      .then(({ roleSelect }) => {
        console.log(roleSelect);
        connection.query(
          "SELECT first_name, last_name, role.title FROM employee INNER JOIN role ON employee.role_id = role.id WHERE role.title = ?",
          [roleSelect],
          (err, res) => {
            if (err) throw err;
            console.table(res);
            startFunction();
          }
        );
      });
  });
}

// Function to add employee

function addEmployee() {
  connection.query("SELECT title, id FROM role", (err, data) => {
    if (err) throw err;
    const titleSelection = [];
    for (let i = 0; i < data.length; i++) {
      const idChoice = {
        name: data[i].title,
        value: data[i].id,
      };
      titleSelection.push(idChoice);
    }
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is the employee's first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "What is the employee's last name?",
        },
        {
          name: "position",
          type: "list",
          message: "What is the employee's role?",
          choices: titleSelection,
        },
      ])
      .then(({ firstName, lastName, position }) => {
        connection.query(
          "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?);",
          [firstName, lastName, position],
          (err, res) => {
            if (err) throw err;
            viewAllEmployees();
          }
        );
      });
  });
}

// Function to add department
function addDepartment() {
  inquirer
    .prompt({
      name: "newDepartment",
      message: "Please enter a new department:",
      type: "input",
    })
    .then(({ newDepartment }) => {
      console.log(newDepartment);
      connection.query(
        "INSERT INTO departments (name) VALUE (?)",
        [newDepartment],
        (err, res) => {
          if (err) throw err;
          console.log("New department added.");
          viewAllEmployees();
        }
      );
    });
}

// Function to add role

function addRole() {
  connection.query("SELECT name, id FROM departments", (err, data) => {
    if (err) throw err;
    const addRoleToDepartment = [];
    for (let i = 0; i < data.length; i++) {
      const departmentID = {
        name: data[i].name,
        value: data[i].id,
      };
      addRoleToDepartment.push(departmentID);
      // console.log(addRoleToDepartment)
    }

    inquirer
      .prompt([
        {
          name: "newTitle",
          message: "Please enter a new title:",
          type: "input",
        },
        {
          name: "newSalary",
          message: "Please enter a salary for the new title:",
          type: "input",
        },
        {
          name: "addToDepartment",
          message:
            "Please select which department you would like to add this title to:",
          type: "list",
          choices: addRoleToDepartment,
        },
      ])
      .then(({ newTitle, newSalary, addToDepartment }) => {
        // console.log(newTitle, newSalary, addToDepartment)
        connection.query(
          "INSERT INTO role (title, salary, departments_id) VALUES (?, ?, ?)",
          [newTitle, newSalary, addToDepartment],
          (err, res) => {
            if (err) throw err;
            console.log("New title successfully added.");
            viewAllEmployees();
          }
        );
      });
  });
}
