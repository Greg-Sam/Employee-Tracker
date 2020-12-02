const mysql = require('mysql2')

const db = mysql.createConnection('mysql://root:MySQL1!@localhost/employees_db')



// db.query('SELECT * FROM departments', (err, departments) => {
//   if (err) { console.log(err) }
//   console.log(departments)
// })

// db.query(`
//   SELECT roles.id, roles.title, roles.salary, departments.name AS department
//   FROM roles
//   LEFT JOIN departments
//   ON roles.departmentId = departments.id
//   `, (err, roles) => {
//     if (err) { console.log(err) }
//     console.log(roles)
//   })

// db.query(`
//   SELECT employees.id, employees.firstName, employees.lastName, roles.title, roles.salary, departments.name AS department, CONCAT(manager.firstName, ' ', manager.lastName) AS manager
//   FROM employees LEFT JOIN roles ON employees.roleId = roles.id
//   LEFT JOIN departments ON roles.departmentId = departments.id
//   LEFT JOIN employees manager on manager.id = employees.managerId
// `, (err, employees) => {
//   if (err) { console.log(err) }
//   console.log(employees)
// })