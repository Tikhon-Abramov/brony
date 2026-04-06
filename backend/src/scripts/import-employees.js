import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { pool } from '../config/db.js';
import { testDbConnection } from '../config/db.js';

const FILE_PATH = path.resolve(process.cwd(), 'data', 'employees.csv');

function normalizeValue(value) {
    return String(value || '').trim();
}

async function ensureDepartment(name) {
    const [existingRows] = await pool.query(
        `
      SELECT id
      FROM departments
      WHERE name = ?
      LIMIT 1
    `,
        [name],
    );

    if (existingRows.length > 0) {
        return existingRows[0].id;
    }

    const [result] = await pool.query(
        `
      INSERT INTO departments (name, created_at, updated_at)
      VALUES (?, NOW(), NOW())
    `,
        [name],
    );

    return result.insertId;
}

async function upsertEmployee(fullName, departmentId) {
    const [existingRows] = await pool.query(
        `
      SELECT id
      FROM employees
      WHERE full_name = ?
      LIMIT 1
    `,
        [fullName],
    );

    if (existingRows.length > 0) {
        await pool.query(
            `
        UPDATE employees
        SET department_id = ?,
            updated_at = NOW()
        WHERE id = ?
      `,
            [departmentId, existingRows[0].id],
        );

        return {
            type: 'updated',
            id: existingRows[0].id,
        };
    }

    const [result] = await pool.query(
        `
      INSERT INTO employees (full_name, department_id, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
    `,
        [fullName, departmentId],
    );

    return {
        type: 'created',
        id: result.insertId,
    };
}

async function main() {
    try {
        await testDbConnection();

        if (!fs.existsSync(FILE_PATH)) {
            throw new Error(`Файл не найден: ${FILE_PATH}`);
        }

        const fileContent = fs.readFileSync(FILE_PATH, 'utf8');

        const rows = parse(fileContent, {
            delimiter: '|',
            trim: true,
            skip_empty_lines: true,
            bom: true,
        });

        let createdDepartments = 0;
        let createdEmployees = 0;
        let updatedEmployees = 0;

        for (const row of rows) {
            if (!Array.isArray(row) || row.length < 2) {
                console.warn('Пропущена некорректная строка:', row);
                continue;
            }

            const departmentName = normalizeValue(row[0]);
            const fullName = normalizeValue(row[1]);

            if (!departmentName || !fullName) {
                console.warn('Пропущена пустая строка:', row);
                continue;
            }

            const [departmentBefore] = await pool.query(
                `
          SELECT id
          FROM departments
          WHERE name = ?
          LIMIT 1
        `,
                [departmentName],
            );

            const departmentId = await ensureDepartment(departmentName);

            if (departmentBefore.length === 0) {
                createdDepartments += 1;
            }

            const result = await upsertEmployee(fullName, departmentId);

            if (result.type === 'created') {
                createdEmployees += 1;
            } else {
                updatedEmployees += 1;
            }
        }

        console.log('Импорт завершён');
        console.log({
            createdDepartments,
            createdEmployees,
            updatedEmployees,
        });

        process.exit(0);
    } catch (error) {
        console.error('Ошибка импорта:', error);
        process.exit(1);
    }
}

main();