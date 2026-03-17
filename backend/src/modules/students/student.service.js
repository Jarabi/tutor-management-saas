import pool from '../../config/db.js';

export const createStudent = async (tenantId, data) => {
    const { name, parent_phone } = data;

    const result = await pool.query(
        `INSERT INTO students (tenant_id, name, parent_phone)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [tenantId, name, parent_phone],
    );
    return result;
};

export const getStudents = async (tenantId, limit, offset) => {
    const result = await pool.query(
        `SELECT *
        FROM students
        WHERE tenant_id = $1
        ORDER BY created_at DESC
        LIMIT $2
        OFFSET $3`,
        [tenantId, limit, offset],
    );
    return result;
};

export const countStudents = async (tenantId) => {
    const result = await pool.query(
        `SELECT COUNT(*) FROM students WHERE tenant_id = $1`,
        [tenantId],
    );
    return parseInt(result.rows[0].count, 10);
};

export const getStudent = async (tenantId, studentId) => {
    const result = await pool.query(
        `SELECT *
        FROM students
        WHERE id = $1 AND tenant_id = $2`,
        [studentId, tenantId],
    );

    return result;
};

export const updateStudent = async (tenantId, studentId, data) => {
    const { name, parent_phone } = data;

    const result = await pool.query(
        `UPDATE students
        SET name = $1, parent_phone = $2
        WHERE id = $3 AND tenant_id = $4
        RETURNING *`,
        [name, parent_phone, studentId, tenantId],
    );

    return result;
};

export const deleteStudent = async (tenantId, studentId) => {
    const result = await pool.query(
        `DELETE FROM students WHERE id = $1 AND tenant_id = $2 RETURNING *`,
        [studentId, tenantId],
    );
    return result;
};