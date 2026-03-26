import pool from '../../config/db.js';

export const createClass = async (tenantId, data) => {
    const { subject, schedule_day, schedule_time, monthly_fee } = data;

    const query = `
        INSERT INTO classes (tenant_id, subject, schedule_day, schedule_time, monthly_fee)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const values = [
        tenantId,
        subject,
        schedule_day,
        schedule_time,
        monthly_fee,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};

export const getClassesWithCount = async (tenantId, limit, offset) => {
    const result = await pool.query(
        `SELECT *, COUNT(*) OVER() AS total_count
        FROM classes
        WHERE tenant_id = $1
        ORDER BY created_at DESC
        LIMIT $2
        OFFSET $3`,
        [tenantId, limit, offset],
    );
    const totalCount = result.rows[0]?.total_count ?? 0;
    return { rows: result.rows, totalCount: parseInt(totalCount, 10) };
};

export const getClassById = async (tenantId, classId) => {
    const result = await pool.query(
        'SELECT * FROM classes WHERE tenant_id=$1 and id=$2',
        [tenantId, classId],
    );
    return result;
};

export const updateClass = async (tenantId, classId, data) => {
    const { subject, schedule_day, schedule_time, monthly_fee } = data;

    const query = `
        UPDATE classes
        SET subject=$1,
            schedule_day=$2,
            schedule_time=$3,
            monthly_fee=$4
        WHERE tenant_id=$5 and id=$6
        RETURNING *;
    `;

    const values = [
        subject,
        schedule_day,
        schedule_time,
        monthly_fee,
        tenantId,
        classId,
    ];

    const result = await pool.query(query, values);
    return result;
};

export const deleteClass = async (tenantId, classId) => {
    const result = await pool.query(
        'DELETE FROM classes WHERE tenant_id=$1 AND id=$2 RETURNING *',
        [tenantId, classId],
    );
    return result;
};

export const enrollStudent = async (tenantId, classId, studentId) => {
    const query = `
        INSERT INTO student_classes (tenant_id, student_id, class_id)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const values = [tenantId, studentId, classId];

    const result = await pool.query(query, values);

    return result.rows[0];
};

export const getStudentsInClass = async (tenantId, classId) => {
    const query = `
        SELECT s.*
        FROM students s
        JOIN student_classes sc
            ON s.id = sc.student_id
        WHERE sc.class_id = $1
        AND sc.tenant_id = $2
    `;
    const result = pool.query(query, [classId, tenantId]);
    return (await result).rows;
};

export const removeStudentFromClass = async (tenantId, classId, studentId) => {
    const student = await pool.query(
        `DELETE FROM student_classes
        WHERE tenant_id=$1 AND class_id=$2 AND student_id=$3
        RETURNING *`,
        [tenantId, classId, studentId],
    );
    return student;
};
