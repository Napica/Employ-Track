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
      choices: ["View All Employees"],
    })
    .then(function (answer) {
      //   console.log(answer);
      if (answer.start === "View All Employees") {
        viewAllEmployees();
      }
    });
}

function viewAllEmployees() {
  //   console.log("you can see this");
  connection.query(
    "SELECT first_name, last_name, title, salary, name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department on employee.department_id = department.id",
    (err, data) => {
      if (err) throw err;
      console.table(data);
      startFunction()
    }
  );
}
