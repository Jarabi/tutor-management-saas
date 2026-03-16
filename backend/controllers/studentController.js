import pool from '../config/db.js';

export const getStudents = async (req, res) => {
    // IMPORTANT: tenantId never comes from client input
    // It comes only from the verified JWT
    const tenantId = req.tenantId;

    try {
        const result = await pool.query(
            'SELECT * FROM students WHERE tenant_id = $1',
            [tenantId],
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Create students with tenant isolation
export const createStudent = async (req, res) => {
    const tenantId = req.tenantId;
    const { name, parent_phone } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ message: 'name is required' });
    }

    try {
        // Notice: tenant ID inserted automatically
        const result = await pool.query(
            `INSERT INTO students (tenant_id, name, parent_phone)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [tenantId, name, parent_phone],
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};