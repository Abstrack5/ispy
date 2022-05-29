const inquirer = require("inquirer");
const mysql = require("mysql2");
const config = require("config");
const { listenerCount } = require("process");
const user = config.get("server.user");
const pw = config.get("server.password");

const server = mysql.createConnection({
  host: "localhost",
  user: user,
  password: pw,
  database: "the_office",
});

server.connect((err) => {
  if (err) throw err;
  console.log(`>You are now connected to "The Office" database<`);
  promptUser();
});

console.log("+==============================================+");
console.log("|                    HELLO                     |");
console.log("|                   WELCOME                    |");
console.log("+==============================================+");

const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "start",
        loop: false,
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an Employee role",
          "Exit",
        ],
      },
    ])
    .then((data) => {
      switch (data.start) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployee();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRoles();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an Employee role":
          updateEmployeeRole();
          break;
        default:
          console.log("+==============================================+");
          console.log("|                     BYE                      |");
          console.log("+==============================================+");
          server.end();
      }
    });
};

// --------------------------------- || View Functions || --------------------------------------- \\
viewDepartments = () => {
  console.log("Viewing all departments..");
  const sql = `SELECT department.id, department.name AS department
                FROM department`;

  server.query(sql, (err, rows) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.table(rows);
    promptUser();
  });
};

viewRoles = () => {
  console.log("Viewing all roles... ");
  const sql = `SELECT department.id, department.name AS department, roles.title AS job_title, roles.salary 
                FROM roles
                LEFT JOIN department
                ON roles.department_id = department.id
                ORDER BY department.id ASC`;

  server.query(sql, (err, rows) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.table(rows);
    promptUser();
  });
};

viewEmployee = () => {
  console.log("Viewing all Employees... ");
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.salary, roles.title AS job_title, department.name AS department,
                boss.last_name AS manager
                FROM employee
                LEFT JOIN roles 
                ON employee.role_id = roles.id
                LEFT JOIN department
                ON roles.department_id = department.id
                LEFT JOIN employee AS boss
                ON boss.id = employee.manager_id`;

  server.query(sql, (err, rows) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.table(rows);
    promptUser();
  });
};

// ---------------------------------- || Add Functions || --------------------------------------- \\
addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "text",
        name: "newDepartment",
        message: "What is the name of the new department?",
      },
    ])
    .then((data) => {
      const sql = `INSERT INTO department (name)
                VALUES (?)`;
      server.query(sql, [data.newDepartment], (err, results) => {
        if (err) {
          console.log(err.message);
          return;
        }
        console.log("Successfully added new department!");
        promptUser();
      });
    });
};

addRoles = () => {
  const departmentChoices = [];
  const deptSql = `SELECT * FROM department`;
  server.query(deptSql, (err, results) => {
    if (err) {
      console.log(err.message);
      return;
    }
    results.forEach((department) => {
      let departmentObj = {
        name: department.name,
        value: department.id,
      };
      departmentChoices.push(departmentObj);
    });
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the role",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role",
      },
      {
        type: "list",
        name: "department",
        message: "Which department does this role belong to",
        choices: departmentChoices,
      },
    ])
    .then((data) => {
      const sql = `INSERT INTO roles (title, salary, department_id)
                    VALUES (?,?,?)`;
      server.query(
        sql,
        [data.title, data.salary, data.department],
        (err, results) => {
          if (err) {
            console.log(err.message);
            return;
          } else {
            console.log(`Successfully added new role ${data.title}!`);
            promptUser();
          }
        }
      );
    });
};

addEmployee = () => {
  const rolesArr = [];
  const rolesSql = `SELECT * FROM roles`;
  server.query(rolesSql, (err, results) => {
    if (err) {
      console.log(err.message);
      return;
    } else {
      results.forEach((role) => {
        let rolesObj = {
          name: role.title,
          value: role.id,
        };
        rolesArr.push(rolesObj);
      });
    }
  });
  const managerArr = [];
  const employeeSql = `SELECT * FROM employee`;
  server.query(employeeSql, (err, results) => {
    if (err) {
      console.log(err.message);
      return;
    } else {
      results.forEach((employee) => {
        let employeeObj = {
          name: employee.last_name,
          id: employee.manager_id,
          value: employee.id,
        };
        managerArr.push(employeeObj);
      });
    }
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee last name?",
      },
      {
        type: "list",
        name: "roleTitle",
        loop: false,
        message: "What is the employee role?",
        choices: rolesArr,
      },
      {
        type: "list",
        name: "manager",
        loop: false,
        message: "Who is the manager of the employee?",
        choices: managerArr,
      },
    ])
    .then((data) => {
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
      server.query(
        sql,
        [data.first_name, data.last_name, data.roleTitle, data.manager],
        (err, rows) => {
          if (err) {
            console.log(err.message);
            return;
          } else {
            console.log("Successfully added new employee!");
            promptUser();
          }
        }
      );
    });
};

// ---------------------------------- || Update Functions || --------------------------------------- \\
updateEmployeeRole = () => {
    const employeeArr = [];
    server.query(`SELECT * FROM employee`, (err, results) => {
        if (err) {
            console.log(err.message);
            return;
        } else {
            
            results.forEach(({first_name, last_name, id}) => {
                employeeArr.push({
                    name: first_name + " " + last_name,
                    value: id
                })
            })
        }
        const rolesArr = [];
        server.query(`SELECT * FROM roles`, (err, results) => {
            if (err) {
                console.log(err.message)
                return;
            } else {
               
                results.forEach(({title, id}) => {
                     rolesArr.push({
                         name: title,
                         value: id
                     })
                })
            }
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'id',
                    choices: employeeArr,
                    message: 'Which employee is to be updated?',
                    loop: false
                },
                {
                    type: 'list',
                    name: 'role_id',
                    choices: rolesArr,
                    loop: false,
                    message: 'What is the new role?'
                }
            ])
            .then(data => {
                const sql = `UPDATE employee SET ? WHERE ?? = ?`
                server.query(sql,[{role_id: data.role_id}, "id", data.id], (err, result) => {
                    if (err) {
                        console.log(err.message)
                        return;
                    } else {
                        console.log('Sucesss!')
                        promptUser();
                    }
                })
            })
        })
    })
}