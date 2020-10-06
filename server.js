const mysql = require("mysql");
const inquirer = require("inquirer");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "shepard1",
  database: "employee_DB",
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
        "Add Employee",
        "EXIT",
      ],
    })
    .then(function (answer) {
      //   console.log(answer);
      if (answer.start === "View All Employees") {
        viewAllEmployees();
      } else if (answer.start === "View All Employees by Department") {
        viewEmployeesByDepartment();
      } else if (answer.start === "Add Employee") {
        // console.log("this was chosen")
        addEmployee();
      } else if (answer.start === "EXIT") {
        connection.end();
      }
    });
}

// function to view all employees
function viewAllEmployees() {
  connection.query(
    "SELECT first_name, last_name, title, salary, name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN departments On employee.departments_id = departments.id",
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

function addEmployee() {
  connection.query("SELECT title FROM role", (err, data) => {
    if (err) throw err;
    const titleSelection = [];
    for (let i = 0; i < data.length; i++) {
      titleSelection.push(data[i]);
    //   console.log(data[i])
    }
    // console.log(titleSelection);
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
        console.log(firstName, lastName, position);
      });
  });
}
