# NestJS Todo Application

[![codecov](https://codecov.io/gh/dauddi/nest-todo/branch/main/graph/badge.svg?token=c6ca1570-d1e2-4639-b78d-19b80fd26c39)](https://codecov.io/gh/your-username/nest-todo)

This project is a simple Todo application built with [NestJS](https://nestjs.com/), TypeORM, MySQL, and [htmx](https://htmx.org/). The application includes authentication, CRUD operations for todos, and a clean and responsive UI with support for E2E tests.

## Table of Contents

- [NestJS Todo Application](#nestjs-todo-application)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Running the App](#running-the-app)
  - [Testing](#testing)
    - [Unit tests](#unit-tests)
    - [End-to-End (E2E) tests](#end-to-end-e2e-tests)
    - [Test coverage](#test-coverage)
  - [Project Structure](#project-structure)
  - [Using htmx](#using-htmx)
  - [License](#license)

## Features

- User registration and authentication (JWT)
- Create, read, update, and delete todos
- Simple UI with EJS templates and htmx for dynamic interactions
- Responsive design
- Unit and E2E tests

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- [MySQL](https://www.mysql.com/downloads/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dauddi/nest-todo.git
   cd nest-todo
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up the database:**

   Make sure you have a MySQL server running. Create a database named `todos`:

   ```sql
   CREATE DATABASE todos;
   ```

4. **Configure environment variables:**

   Create a `.env` file in the root of the project and add the following:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=db
   DB_PASSWORD=test
   DB_DATABASE=todos
   JWT_SECRET=your_jwt_secret
   ```

## Running the App

1. **Start the development server:**

   ```bash
   pnpm run start:dev
   ```

2. **Open your browser and navigate to:**

   ```
   http://localhost:3000
   ```

## Testing

### Unit tests

To run unit tests:

```bash
pnpm run test
```

### End-to-End (E2E) tests

To run E2E tests:

```bash
pnpm run test:e2e
```

### Test coverage

To check the test coverage:

```bash
pnpm run test:cov
```

## Project Structure

```text
src/
├── app.controller.ts
├── app.module.ts
├── auth/
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── constants.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
├── main.ts
├── todos/
│   ├── todos.controller.ts
│   ├── todos.module.ts
│   ├── todos.service.ts
│   ├── dto/
│   │   ├── create-todo.dto.ts
│   │   └── update-todo.dto.ts
│   ├── entities/
│   │   └── todo.entity.ts
views/
├── auth/
│   ├── login.ejs
│   └── register.ejs
├── todos/
│   ├── index.ejs
│   └── edit.ejs
└── index.ejs
public/
├── css/
│   └── styles.css
└── js/
    └── htmx.min.js
test/
├── app.e2e-spec.ts
```

## Using htmx

The application leverages htmx to provide dynamic and responsive interactions without requiring a full page reload. htmx is a library that allows you to access modern browser features directly from HTML, using attributes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This README provides a clear overview of the project, instructions for setup, and details on how to run, test, and extend the application, including the use of htmx for dynamic and responsive UI interactions.
