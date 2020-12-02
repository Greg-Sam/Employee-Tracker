const inquirer = require('inquirer')
const mysql = require('mysql2')
require('console.table')

const db = mysql.createConnection('mysql://root:MySQL1!@localhost/employees_db')

const mainMenu = () => {
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View Database Tables', 'Add to Database', 'Update Employee Role', 'EXIT']
  })
    .then(({ action }) => {
      switch (action) {
        case 'View Database Tables':
          viewDataBase()
          break
        case 'Add to Database':
          addToDataBase()
          break
        case 'Update Employee Role':
          // updateEmployeeRole()
          break
        case 'EXIT':
          process.exit()
          break
      }
    })
    .catch(err => console.log(err))
}

const viewDataBase = () => {
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Which database table would you like to view?',
    choices: ['View Departments', 'View Roles', 'View Employees', 'Return to Main Menu']
  })
    .then(({ action }) => {
      switch (action) {
        case 'View Departments':
          viewDepartments()
          break
        case 'View Roles':
          viewRoles()
          break
        case 'View Employees':
          viewEmployees()
          break
        case 'Return to Main Menu':
          mainMenu()
          break
      }
    })
    .catch(err => console.log(err))
}

const addToDataBase = () => {
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'Which database table would you like to add to?',
    choices: ['Add Department', 'Add Role', 'Add Employee', 'Return to Main Menu']
  })
    .then(({ action }) => {
      switch (action) {
        case 'Add Department':
          // addDepartment()
          break
        case 'Add Role':
          // addRole()
          break
        case 'Add Employee':
          // addEmployees()
          break
        case 'Return to Main Menu':
          mainMenu()
          break
      }
    })
    .catch(err => console.log(err))
}

const viewDepartments = () => {
  db.query('SELECT name AS Department FROM departments', (err, departments) => {
    if (err) { console.log(err) }
    console.table(departments)
    mainMenu()
  })
}

const viewRoles = () => {
    db.query(`
    SELECT roles.id, roles.title, roles.salary, departments.name AS department
    FROM roles
    LEFT JOIN departments
    ON roles.departmentId = departments.id
    `, (err, roles) => {
      if (err) { console.log(err) }
      console.table(roles)
        mainMenu()
  })
 
}

const viewEmployees = () => {
  db.query(`
  SELECT employees.id, employees.firstName, employees.lastName, roles.title, roles.salary, departments.name AS department, CONCAT(manager.firstName, ' ', manager.lastName) AS manager
  FROM employees LEFT JOIN roles ON employees.roleId = roles.id
  LEFT JOIN departments ON roles.departmentId = departments.id
  LEFT JOIN employees manager on manager.id = employees.managerId
`, (err, employees) => {
    if (err) { console.log(err) }
    console.table(employees)
      mainMenu()
  })
}

const addDepartment = () => {
  db.query('SELECT name AS Department FROM departments', (err, departments) => {
    if (err) { console.log(err) }
    console.table(departments)
    mainMenu()
  })
}


mainMenu()


