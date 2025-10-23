-- Script de inicialização do banco de dados Personal Finance
-- Este script é executado automaticamente quando o container MySQL é criado pela primeira vez
-- Criar o banco de dados se não existir
CREATE DATABASE IF NOT EXISTS personal_finance;

-- Usar o banco de dados
USE personal_finance;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    birthdate DATE NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NULL,
    document VARCHAR(255) UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    categoryId INT NOT NULL,
    description TEXT NULL,
    amountInCents INT NOT NULL,
    userId INT NOT NULL,
    date DATE NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Inserir algumas categorias de exemplo
INSERT
    IGNORE INTO categories (name)
VALUES
    ('Alimentação'),
    ('Transporte'),
    ('Saúde'),
    ('Educação'),
    ('Entretenimento'),
    ('Salário'),
    ('Freelance'),
    ('Investimentos');

-- Inserir um usuário de exemplo (senha: password123)
INSERT
    IGNORE INTO users (email, password, fullname, document)
VALUES
    (
        'admin@example.com',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'Administrador',
        '12345678901'
    );

-- Inserir algumas transações de exemplo
INSERT
    IGNORE INTO transactions (
        title,
        categoryId,
        amountInCents,
        userId,
        date,
        type
    )
VALUES
    (
        'Salário Mensal',
        6,
        500000,
        1,
        CURDATE(),
        'income'
    ),
    (
        'Compras Supermercado',
        1,
        15000,
        1,
        CURDATE(),
        'expense'
    ),
    ('Uber', 2, 2500, 1, CURDATE(), 'expense');