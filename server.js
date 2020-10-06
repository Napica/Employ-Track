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
        "EXIT",
      ],
    })
    .then(function (answer) {
      //   console.log(answer);
      if (answer.start === "View All Employees") {
        viewAllEmployees();
      } else if (answer.start === "View All Employees by Department") {
        viewEmployeesByDepartment();
      } else if (answer.start === "EXIT") {
        connection.end();
      }
    });
}

function viewAllEmployees() {
  //   console.log("you can see this");
  connection.query(
    "SELECT first_name, last_name, title, salary, department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department on employee.department_id = department.id",
    (err, data) => {
      if (err) throw err;
      console.table(data);
      startFunction();
    }
  );
}

function viewEmployeesByDepartment() {
  connection.query(
    "SELECT first_name, last_name, department FROM employee INNER JOIN departments on employee.department_id = departments.id",
    (err, data) => {
      if (err) throw err;
      const departmentChoice = [];
      for (var i = 0; i < data.length; i++) {
        departmentChoice.push(data[i].department);
      }
      inquirer
        .prompt({
          name: "choice",
          type: "rawlist",
          choices: departmentChoice,
          message: "Which department, would you like to chose?",
        })
        .then(function (answer) {
          var chosenDepartment;
          for (var i = 0; i < data.length; i++) {
            if (data[i].department === answer.choice) {
              chosenDepartment = data[i];
              console.table(data[i]);
            }
          }
          startFunction();
        });
    }
  );
}
