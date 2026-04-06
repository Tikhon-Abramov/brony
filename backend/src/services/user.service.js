import { pool } from '../config/db.js';

export async function findUserByLogin(login) {
    const [rows] = await pool.query(
        `
            SELECT
                id,
                name,
                login,
                password,
                role
            FROM users
            WHERE login = ?
                LIMIT 1
        `,
        [login],
    );

    return rows[0] || null;
}

export async function findUserById(id) {
    const [rows] = await pool.query(
        `
            SELECT
                id,
                name,
                login,
                role
            FROM users
            WHERE id = ?
                LIMIT 1
        `,
        [id],
    );

    return rows[0] || null;
}

export async function createOrUpdateAdmin({ name, login, passwordHash }) {
    const [existingRows] = await pool.query(
        `
      SELECT id
      FROM users
      WHERE login = ?
      LIMIT 1
    `,
        [login],
    );

    if (existingRows.length > 0) {
        await pool.query(
            `
        UPDATE users
        SET name = ?,
            password = ?,
            role = 'admin',
            updated_at = NOW()
        WHERE login = ?
      `,
            [name, passwordHash, login],
        );

        const [rows] = await pool.query(
            `
        SELECT
          id,
          name,
          login,
          role
        FROM users
        WHERE login = ?
        LIMIT 1
      `,
            [login],
        );

        return rows[0];
    }

    const [result] = await pool.query(
        `
      INSERT INTO users (
        name,
        login,
        password,
        role,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, 'admin', NOW(), NOW())
    `,
        [name, login, passwordHash],
    );

    const [rows] = await pool.query(
        `
      SELECT
        id,
        name,
        login,
        role
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
        [result.insertId],
    );

    return rows[0];
}