const inquirer = require('inquirer')
const mysql = require('mysql2')
require('console.table')

const db = mysql.createConnection('mysql://root:MySQL1!@localhost/employees_db')

const mainMenu = () => {
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: ['View Directories', 'Add to Database', 'Update Employee Role', 'EXIT']
  })
    .then(({ action }) => {
      switch (action) {
        case 'View Directories':
          viewDataBase()
          break
        case 'Add to Database':
          addToDataBase()
          break
        case 'Update Employee Role':
          updateEmployeeRole()
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
          addDepartment()
          break
        case 'Add Role':
          addRole()
          break
        case 'Add Employee':
          addEmployee()
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
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the new department?'
    }
  ])
    .then(data => {
      db.query('INSERT INTO departments SET ?', data, err => {
        if (err) { console.log(err) }
        console.log(`
        --------------------
        ${data.name} department added
        --------------------`)
        mainMenu()
      })
    })
}


const addRole = () => {
  db.query('SELECT * FROM departments', (err, departments) => {
    if (err) { console.log(err) }
    //   departments.map(departments => 
    //     console.log(departments.name))

    //   })
    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the new role?'
      },
      {
        type: 'number',
        name: 'salary',
        message: 'What is the salary for this role?'
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'Which department is this role a part of?',
        choices: departments.map(department => ({
          name: `${department.name}`,
          value: department.id
        }))
      }
    ])
      .then(data => {

        db.query('INSERT INTO roles SET ?', data, err => {
          if (err) { console.log(err) }
          console.log(`
          --------------------
          ${data.title} role added
          --------------------`)
          mainMenu()

        })

      })
  })
}

const addEmployee = () => {
  db.query('SELECT * FROM roles', (err, roles) => {
    if (err) { console.log(err) }
    db.query(`SELECT * FROM employees`, (err, employees) => {
      if (err) { console.log(err) }
    // roles.map(roles =>
    //   console.log(roles.title))
    inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: `What is the employee's first name?`
      },
      {
        type: 'input',
        name: 'lastName',
        message: `What is the employee's last name?`
      },
      {
        type: 'list',
        name: 'roleId',
        message: `What is the employee's role`,
        choices: roles.map(role => ({
          name: `${role.title}`,
          value: role.id
        }))
      }, 
      {
        type: 'list',
        name: 'managerId',
        message: `Who is the employee's manager`,
        choices: employees.map(employee => ({
          name: `${employee.firstName} ${employee.lastName}`,
          value: employee.id
        }))
      }, 
    ])
      .then(data => {

        db.query('INSERT INTO employees SET ?', data, err => {
          if (err) { console.log(err) }
          console.log(`
          --------------------
          ${data.firstName} ${data.lastName} added
          --------------------`)
          mainMenu()
        })

      })
  })
})}

// const hasManager = () => {
//   db.query('SELECT * FROM employees', (err, data) => {
//     if (err) { console.log(err) }
//     // console.log(data)
//     inquirer.prompt([
//       {
//         type: 'list',
//         name: 'managed',
//         message: 'Does this employee have a manager?',
//         choices: ['Yes', 'No']
//       }
//     ])
//       .then(({ managed }) => {


//         switch (managed) {
//           case 'No':
            
//             mainMenu()
//             break
//           case 'Yes':
//             addManager()
//         }
//       }
//       )
//   }
//   )
// }

// const addManager = () => {
//   db.query('SELECT * FROM employees', (err, managerSearch) => {
//     if (err) { console.log(err) }
//     console.log(managerSearch)
//     inquirer.prompt([
//       {
//         type: 'list',
//         name: 'managerId',
//         message: `What is the manager's name?`,
//         choices: managerSearch.map(manager => ({
//           name: `${manager.firstName} ${manager.lastName}`,
//           value: manager.id
//         })
//           )
//       }
//     ])
//       .then(data => {
//         console.log(data)
//       })
//     })}



const updateEmployeeRole = () => {
  db.query(`SELECT * FROM employees`, (err, employees) => {
    if (err) { console.log(err) }
  db.query(`SELECT * FROM roles`, (err, roles) => {
      if (err) { console.log(err) }
      // console.log(roles)

    inquirer.prompt([
      {
        type: 'list',
        name: 'id',
        message: 'Select the employee you want to change roles for.',
        choices: employees.map(employee => ({
          name: `${employee.firstName} ${employee.lastName}`,
          value: employee.id
        }))
      },
      {
        type: 'list',
        name: 'roleId',
        message: `What is the employee's new role?`,
        choices: roles.map(role => ({
          name: `${role.title}`,
          value: role.id
        }))
      }
    ])
      .then(data => {
        db.query('UPDATE employees SET ? WHERE ?', [{ roleId: data.roleId }, { id: data.id }], err => {
          if (err) { console.log(err) }
          console.log(`
          -----------------
          role updated
          -----------------`)
          mainMenu()
        })
      })
      .catch(err => console.log(err))
  })
})
}

mainMenu()
