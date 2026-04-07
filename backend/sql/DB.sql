CREATE DATABASE IF NOT EXISTS brony
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE brony;

CREATE TABLE IF NOT EXISTS departments (
                                           id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                           name VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS employees (
                                         id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                         full_name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_employees_department
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
                                                           ON DELETE RESTRICT
                                                           ON UPDATE CASCADE,
    UNIQUE KEY uq_employee_full_name (full_name)
    );

CREATE TABLE IF NOT EXISTS users (
                                     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                     name VARCHAR(255) NOT NULL,
    login VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin') NOT NULL DEFAULT 'admin',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS bookings (
                                        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                        employee_id INT NOT NULL,
                                        department_id INT NOT NULL,
                                        purpose VARCHAR(1024) NOT NULL,
    room_name VARCHAR(255) NOT NULL DEFAULT 'Конференц-зал',
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'unreviewed') NOT NULL DEFAULT 'pending',
    rejection_reason TEXT NULL,
    processed_by_user_id INT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_bookings_employee
    FOREIGN KEY (employee_id)
    REFERENCES employees(id)
                                                           ON DELETE RESTRICT
                                                           ON UPDATE CASCADE,

    CONSTRAINT fk_bookings_department
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
                                                           ON DELETE RESTRICT
                                                           ON UPDATE CASCADE,

    CONSTRAINT fk_bookings_processed_by_user
    FOREIGN KEY (processed_by_user_id)
    REFERENCES users(id)
                                                           ON DELETE SET NULL
                                                           ON UPDATE CASCADE
    );

CREATE INDEX idx_bookings_date_status ON bookings(date, status);
CREATE INDEX idx_bookings_room_date ON bookings(room_name, date);
CREATE INDEX idx_employees_department_id ON employees(department_id);
