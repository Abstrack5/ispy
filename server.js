const inquirer = require('inquirer');
const mysql = require('mysql2');
const config = require('config');
const user = config.get("server.user");
const pw = config.get("server.password");

const server = mysql.createConnection({
    host: 'localhost',
    user: user,
    password: pw,
    database: 'the_office'
});

server.connect(err => {
    if (err) throw err;
    console.log(`>You are now connected to "The Office" database<`);
    promptUser();
});

console.log('+==============================================+');
console.log('|                    HELLO                     |');
console.log('|                   WELCOME                    |');
console.log('+==============================================+');


const promptUser = () => {
    inquirer.prompt([
        {
            type:'list',
            name: 'start',
            loop: false,
            message: 'What would you like to do?',
            choices: ['View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add a employee',
                    'Update an Employee role',
                    'Exit']
        }
    ])
        .then((response) => {
            switch (response.start) {
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
                    default:
                        console.log('+==============================================+');
                        console.log('|                     BYE                      |');
                        console.log('+==============================================+');
                        server.end();
            }
        })
}


// --------------------------------- View Functions --------------------------------------- \\
viewDepartments = () => {
    console.log('Viewing all departments..');
    const sql = `SELECT department.id, department.name AS department
                FROM department`;

    server.query(sql, (err, rows) => {
        if(err) {
            console.log(err.message);
            return;
        }
        console.table(rows);
        promptUser();
    });
};

viewRoles = () => {
    console.log('Viewing all roles... ');
    const sql = `SELECT department.id, department.name AS department, roles.title AS job_title, roles.salary 
                FROM roles
                LEFT JOIN department
                ON roles.department_id = department.id`;

    server.query(sql, (err, rows) => {
        if(err) {
            console.log(err.message);
            return;
        }
        console.table(rows);
        promptUser();
    });
};

viewEmployee = () => {
    console.log('Viewing all Employees... ');
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
        if(err) {
            console.log(err.message);
            return;
        }
        console.table(rows);
        promptUser();
    });
};


// ---------------------------------- Add Functions --------------------------------------- \\
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'text',
            name: 'newDepartment',
            message: 'What is the name of the new department?'
        }
    ])
    .then((data) => {
        const sql = `INSERT INTO department (name)
                VALUES (?)`
        server.query(sql, data.newDepartment, (err, results) =>{
            if(err) {
                console.log(err.message);
                return;
            }
            console.log('Successfully added new department!');
            promptUser();
        });
    });

};