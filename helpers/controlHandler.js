const inquirer = require("inquirer");
const query = require("./dbHandlers");
let quit = false;
const mainMenu = () => {
    const menu = [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit",
    ];
    quit = false;
    // console.clear();
    inquirer
        .prompt({
            type: "list",
            choices: menu,
            name: "menuSelect",
            message: "What would you like to do?",
        })
        .then((answer) => {
            switch (answer.menuSelect) {
                case "View All Employees":
                    query.getAllEmployees();
                    mainMenu();
                    break;
                case "Add Employee":
                    break;
                case "Update Employee Role":
                    break;
                case "View All Roles":
                    query.viewAllRoles();
                    mainMenu();
                    break;
                case "Add Role":
                    break;
                case "View All Departments":
                    query.myQuery("select * from department order by id;");
                    mainMenu();
                    break;
                case "Add Department":
                    addDepartment();
                    
                    break;
                default:
                    console.log("Good Bye");
                    process.exit();
                    break;
            }
        });
};

const addDepartment = async () => {
    // need role
    console.log("add dept func call");
    await inquirer
        .prompt({
            name: "newDept",
            message: "What is the name of new Dept?",
            type: "input",
        })
        .then((answers) => answers.newDept)
        .then((answer) => {
            const qString =`
                INSERT INTO department (name)
                VALUES ('${answer}');
            `;
            query.retrieveData('Select name from department').then((data)=>data.map(row=>row.name)).then((data) =>{
                if(!data.includes(answer)){
                    query.addQuery(qString);
                }else{
                    console.log(`\n 
                    Value is already exist in department table.
                    PLEASE CHOSE ANOTHER NAME!
                    `)
                }
            }); 
             
        });
    mainMenu();
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

module.exports = { addEmployee, addRole, addDepartment, mainMenu };
