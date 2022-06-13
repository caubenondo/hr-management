const inquirer = require("inquirer");
const query = require("./dbHandlers");

const displayETable = `SELECT
                        e.id AS ID, 
                        e.first_name AS 'FIRST NAME', 
                        e.last_name AS 'LAST NAME', 
                        role.title AS 'JOB TITLE', 
                        department.name AS DEPARTMENT, 
                        role.salary AS 'SALARY', 
                        IFNULL(CONCAT(m.first_name, ' ', m.last_name), '') AS 'MANAGER'
                        FROM
                        employee m
                        RIGHT JOIN employee e ON
                        m.id = e.manager_id
                        JOIN (
                        role 
                        JOIN department 
                            ON role.department_id = department.id
                        ) 
                        ON e.role_id = role.id`;

const mainMenu = () => {
    const menu = [
        new inquirer.Separator("----EMPLOYEES 🤓-----"),
        "View All Employees",
        "View by Manager",
        "Add Employee",
        "UPDATE Employee Role",
        "DELETE Employee",
        new inquirer.Separator("----ROLE 👔-----"),
        "View All Roles",
        "Add Role",
        "DELETE Role",
        new inquirer.Separator("----DEPARTMENT 🗄-----"),
        "View All Departments",
        "Add Department",
        "DELETE Department",
        new inquirer.Separator("----QUIT 📵-----"),
        "BUDGET by DEPT",
        "Quit",
    ];

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
                case "View by Manager":
                    viewEbyM();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "UPDATE Employee Role":
                    updateEmployeeRole();
                    break;
                case "DELETE Employee":
                    delEmployee();
                    break;
                case "View All Roles":
                    query.viewAllRoles();
                    mainMenu();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "DELETE Role":
                    delRole();
                    break;
                case "View All Departments":
                    query.myQuery("select * from department order by id;");
                    mainMenu();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "DELETE Department":
                    delDepartment();
                    break;
                case "BUDGET by DEPT":
                    budgetByDept()
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
            const qString = `
                INSERT INTO department (name)
                VALUES ('${answer}');
            `;
            query
                .retrieveData("Select name from department")
                .then((data) => data.map((row) => row.name))
                .then((data) => {
                    if (!data.includes(answer)) {
                        query.addQuery(qString);
                    } else {
                        console.log(`\n 
                    Value is already exist in department table.
                    PLEASE CHOSE ANOTHER NAME!
                    `);
                    }
                });
        });
    mainMenu();
};
const addRole = async () => {
    // need title, salary, department_id
    console.log("add dept func call");
    const jchoices = await query
        .retrieveData("Select name from department order by id;")
        .then((data) => data);
    await inquirer
        .prompt([
            {
                name: "title",
                message: "what is the job title? ",
                type: "input",
            },
            {
                name: "department",
                message: "what is the department that this job belongs to? ",
                type: "list",
                choices: jchoices,
            },
            {
                name: "salary",
                message: "what is the job salary? ",
                type: "input",
            },
        ])
        .then((answers) => Object.values(answers))
        .then(async (arr) => {
            const deptID = await query
                .retrieveData(
                    `select id from department where name = '${arr[1]}'`
                )
                .then((data) => data[0].id);
            const qString = `
                INSERT INTO role (title,salary,department_id)
                VALUES ('${arr[0]}', ${Number(arr[2])}, ${deptID});
            `;
            query.addQuery(qString);
        });

    mainMenu();
};

const addEmployee = async () => {
    // need first_name, last_name, role_id, manager_id

    const elements = [];
    const jobTitles = await query
        .retrieveData("Select title from role;")
        .then((data) => data.map((row) => row.title));

    await inquirer
        .prompt([
            {
                name: "fname",
                message: "First name? ",
                type: "input",
            },
            {
                name: "lname",
                message: "Last name? ",
                type: "input",
            },
            {
                name: "role",
                message: "Job title? ",
                type: "list",
                choices: jobTitles,
            },
        ])
        .then(async (answers) => {
            elements.push(answers.fname);
            elements.push(answers.lname);
            console.log(answers);

            const deptID = await query
                .retrieveData(
                    `select id, department_id from role where title='${answers.role}';`
                )
                .then((data) => {
                    elements.push(data[0].id);
                    return data[0].department_id;
                });
            await console.log(deptID);
            const managers = await query
                .retrieveData(
                    `
                    select 
                        CONCAT(first_name, ' ', last_name) AS full_name
                    from employee
                    join role on
                        employee.role_id = role.id            
                    where role.department_id = ${deptID};
                `
                )
                .then((data) => data.map((name) => name.full_name));
            console.log(managers);
            console.log(elements);
            if (managers) {
                await inquirer
                    .prompt({
                        type: "list",
                        name: "reportTo",
                        message: "Who is this employee report to? ",
                        choices: [...managers, "no one"],
                    })
                    .then((answer) => answer.reportTo)
                    .then(async (answer) => {
                        if (answer == "no one") {
                            elements.push(null);
                        } else {
                            const theManagerID = await query
                                .retrieveData(
                                    `select id from employee where CONCAT(first_name, ' ',last_name) = '${answer}';`
                                )
                                .then((data) => data[0].id);
                            elements.push(theManagerID);
                        }
                    });
            }
        });
    console.log(elements);
    const qString = `
            INSERT INTO employee (first_name,last_name,role_id,manager_id)
            VALUES ('${elements[0]}','${elements[1]}',${elements[2]},${elements[3]});
        `;
    query.addQuery(qString);
    mainMenu();
};

const updateDepartment = () => {
    // retrieve Dept and update name
};
const updateRole = () => {};

const updateEmployeeRole = async () => {
    const nameChoices = await query
        .retrieveData("select id, first_name,last_name from employee;")
        .then((data) =>
            data.map((row) => `${row.id} ${row.first_name} ${row.last_name}`)
        );
    const roles = await query
        .retrieveData("select id,title from role order by id;")
        .then((data) => data.map((row) => `${row.title} id=${row.id}`));
    await inquirer
        .prompt([
            {
                type: "list",
                choices: nameChoices,
                message: "Who do you want to edit their role? ",
                name: "empl",
            },
            {
                type: "list",
                choices: roles,
                message: "which is the new title of this person? ",
                name: "newRole",
            },
        ])
        .then((answers) => {
            console.log(answers);

            const qString = `
                UPDATE employee
                SET
                    role_id = ${answers.newRole.split("id=")[1]}
                WHERE
                    id = ${answers.empl.split(" ")[0]}
            `;
            query.updateQuery(qString);
        });
    mainMenu();
};

const delDepartment = async () => {
    const options = await query
        .retrieveData("select id, name from department order by id;")
        .then((data) => data.map((row) => `${row.id} ${row.name}`));
    await inquirer
        .prompt({
            type: "list",
            choices: options,
            message: "Select Department to set on fire ",
            name: "dRole",
        })
        .then((answer) => {
            const qString = `
                DELETE FROM department
                WHERE
                    id = ${answer.dRole.split(" ")[0]};
            `;
            query.delRecord(qString);
        });
    mainMenu();
};
const delRole = async () => {
    const options = await query
        .retrieveData("select id, title from role order by id;")
        .then((data) => data.map((row) => `${row.id} ${row.title}`));
    await inquirer
        .prompt({
            type: "list",
            choices: options,
            message: "Select Role to drop ",
            name: "dRole",
        })
        .then((answer) => {
            const qString = `
                DELETE FROM role
                WHERE
                    id = ${answer.dRole.split(" ")[0]};
            `;
            query.delRecord(qString);
        });
    mainMenu();
};

const delEmployee = async () => {
    const eOptions = await query
        .retrieveData(
            "select id,first_name,last_name from employee order by id;"
        )
        .then((data) =>
            data.map((row) => `${row.id} ${row.first_name} ${row.last_name}`)
        );
    await inquirer
        .prompt({
            type: "list",
            choices: eOptions,
            message: "Select employee to fire ",
            name: "firedEmpl",
        })
        .then((answer) => {
            const qString = `
                DELETE FROM employee
                WHERE
                    id = ${answer.firedEmpl.split(" ")[0]};
            `;
            query.delRecord(qString);
        });
    mainMenu();
};
const viewEbyM = async () => {
    const managers = await query
        .retrieveData(
            `
            select * from employee
            where ( 
                id in (
                    SELECT manager_id FROM employee
                    where manager_id is not null
            ));
            `
        )
        .then((data) =>
            data.map((row) => `${row.first_name} ${row.last_name} id=${row.id}`)
        );
    await inquirer
        .prompt({
            type: "list",
            choices: managers,
            message: "Select Manager:",
            name: "boss",
        })
        .then((answer) => {
            console.log(answer);
            const qString = `
            ${displayETable}
            WHERE e.manager_id = ${answer.boss.split("id=")[1]}
            ORDER BY e.id;
        `;

            query.myQuery(qString);
        });

    mainMenu();
};

const budgetByDept = () =>{

    const qString = `
        SELECT
            department.name AS DEPARTMENT, 
            sum(role.salary) AS BUDGET
        FROM
            employee m
        RIGHT JOIN employee e ON
            m.id = e.manager_id
        JOIN (
                role 
                JOIN department 
                    ON role.department_id = department.id
        ) 
        ON e.role_id = role.id
        group by    department.name
        order by sum(role.salary) DESC
    ;`
    query.myQuery(qString);
    mainMenu();
};
module.exports = { mainMenu };
