# Employee Management Application

A web application built using LitElement (JavaScript version) to help HR staff manage employee information. This project includes functionality for listing, adding, editing, and deleting employee records.

## Features

1. List All Employee Records

Employee records can be displayed in two formats:

Table view
Grid view

The user can switch between these views using buttons in the header.

Includes pagination functionality for both views.

Each record in the list includes options to edit or delete the record.

2. Add a New Employee Record

A form allows users to add a new employee by providing the following details:

First Name
Last Name
Date of Employment
Date of Birth
Phone Number
Email Address
Department (predefined list: Analytics, Tech)
Position (predefined list: Junior, Medior, Senior)

After successfully adding a new record, the user is navigated back to the employee list page.

3. Edit an Existing Employee Record

Users can edit employee details through a form similar to the one used for adding a new record.

The form is pre-filled with the selected employee's information.

Includes a confirmation prompt before saving changes.

4. Delete an Existing Employee Record

Users can delete a record by clicking the delete button.

A confirmation prompt appears before deleting the record to prevent accidental deletions.

## Additional Features

1. Navigation Menu

A navigation menu allows users to switch between pages.

The menu includes options for viewing the employee list and adding a new employee.

2. Routing

Vaadin Router is used to handle client-side routing.

Routes:

/ - Employee list page
/add - Add new employee page
/edit/:id - Edit existing employee page

3. Responsive Design

The application is designed to be fully responsive on mobile / desktop.

4. State Management

Redux Toolkit is used for state management to persist data.

Data is stored in localStorage to ensure persistence across page reloads.

5. Localization

Supports Turkish and English languages.

The application reads the language setting from localStorage.

## Installation Instructions

* Supported Node.js versions: 18.13.0 - 22.13.0

- Clone the repository:

git clone https://github.com/bulenttyuksel/employee-management.git

cd employee-management

- Install dependencies:

npm install

- Start the development server:

npm run serve

- It opens the browser automatically and navigates to:

http://localhost:8000

## Usage

Listing Employees: View all employee records in table or grid format.

Adding an Employee: Navigate to the 'Add New' page, fill out the form, and submit.

Editing an Employee: Click the edit button on an employee record, make changes, and save.

Deleting an Employee: Click the delete button on an employee record and confirm the action.

## Technologies Used

LitElement: For building web components.

Redux Toolkit: For state management.

Vaadin Router: For client-side routing.

JavaScript (ES Modules): Core language.

HTML5 & CSS3: For layout and styling.

LocalStorage: For persisting data.

Prettier & ESLint: For code formatting and linting.

## Known Issues / Limitations

No backend is integrated; data persistence is limited to localStorage.

No search functionality.

No unit tests.

## Author

Developed by Bülent Yüksel. For any inquiries, please contact bulenttyuksel@gmail.com
