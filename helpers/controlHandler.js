const inquirer = require("inquirer");
const query = require("./dbHandlers");

const addDepartment = () => {
    // need role
};
const addRole = () => {
    // need title, salary, department_id
};

const addEmployee = () => {
    // need first_name, last_name, role_id, manager_id
};

const updateDepartment = () => {
    // retrieve Dept and update name
};
const updateRole = () => {};

const updateEmployee = () => {};

const delDepartment = () => {};
const delRole = () => {};

const delEmployee = () => {};

module.exports = { addEmployee, addRole, addDepartment };
