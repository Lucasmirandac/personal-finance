# Personal Finance API

A NestJS-based personal finance management API with user management, categories, and transaction tracking.

## Features

- **User Management**: Create, read, update, and delete users with email and document validation
- **Category Management**: Manage transaction categories
- **Transaction Management**: Track income and expenses with detailed information
- **Transaction Summary**: Get financial summaries by user
- **Data Validation**: Comprehensive input validation using class-validator
- **Database Integration**: TypeORM with MySQL support
- **Testing**: Unit tests for all services and controllers

## Database Schema

### Users Table

- `id`: Primary key
- `email`: Unique email address
- `birthdate`: User's birth date (optional)
- `password`: Hashed password
- `fullname`: User's full name (optional)
- `document`: Unique document number

### Categories Table

- `id`: Primary key
- `name`: Category name

### Transactions Table

- `id`: Primary key
- `title`: Transaction title
- `category`: Reference to Categories table
- `description`: Transaction description (optional)
- `amountInCents`: Amount in cents
- `user`: Reference to Users table
- `date`: Transaction date
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- `type`: Transaction type (income/expense)

## API Endpoints

### Users

- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/admin/test` - Test endpoint

### Categories

- `POST /categories` - Create a new category
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /categories/admin/test` - Test endpoint

### Transactions

- `POST /transactions` - Create a new transaction
- `GET /transactions` - Get all transactions
- `GET /transactions?userId=:id` - Get transactions by user ID
- `GET /transactions/summary/:userId` - Get transaction summary for user
- `GET /transactions/:id` - Get transaction by ID
- `PATCH /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction
- `GET /transactions/admin/test` - Test endpoint

## Setup

### 🐳 Usando Docker (Recomendado)

#### Script de Gerenciamento (Mais Fácil)

Use o script `docker-manage.sh` para facilitar o gerenciamento:

```bash
# Tornar o script executável (apenas na primeira vez)
chmod +x docker-manage.sh

# Iniciar ambiente de produção
./docker-manage.sh start-prod

# Iniciar ambiente de desenvolvimento
./docker-manage.sh start-dev

# Ver logs da aplicação
./docker-manage.sh logs app

# Ver logs do MySQL
./docker-manage.sh logs mysql

# Parar todos os serviços
./docker-manage.sh stop

# Ver status dos serviços
./docker-manage.sh status

# Ver ajuda completa
./docker-manage.sh help
```

#### Comandos Docker Diretos

1. **Produção:**

```bash
docker compose up --build
```

2. **Desenvolvimento:**

```bash
docker compose -f docker-compose.dev.yml up --build
```

A aplicação estará disponível em `http://localhost:3000` e o MySQL na porta `3306`.

### 📋 Setup Manual

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=personal_finance

# Application Configuration
PORT=3000
NODE_ENV=development
```

3. Run the application:

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Technologies Used

- **NestJS**: Node.js framework
- **TypeORM**: TypeScript ORM with MySQL support
- **MySQL**: Database
- **class-validator**: Validation decorators
- **bcryptjs**: Password hashing
- **Jest**: Testing framework
