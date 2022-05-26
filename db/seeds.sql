INSERT INTO department(name)
VALUES ('Management'), ('Sales'), ('Accountant'), ('HR'), ('Quality Assurance');

INSERT INTO roles (title, salary, department_id)
VALUES
('Regional Manager',60000, 1),
('Salesperson',30000, 2),
('Accountant', 45000, 3),
('Human Resources', 37000,4),
('QA', 40000, 5);

INSERT INTO employee 
    (first_name,
    last_name,
    role_id,
    manager_id)
VALUES
('Michael', 'Scott', '1', NULL),
('Dwight', 'Schrute', '2', 1),
('Jim', 'Halpert', '2', 1),
('Pam', 'Beesly', '2', 1),
('Kevin', 'Malone', '3', 1),
('Oscar', 'Martinez', '3', 1),
('Angela', 'Martin', '3', 1),
('Stanley', 'Hudson', '2', 1),
('Toby', 'Flenderson', '4', 1),
('Meredith', 'Palmer', '5', 1);

