import pool from '../config/db.js';

export const getStudents = async (req, res) => {
    const tenantId = req.tenantId;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query(
            'SELECT * FROM students WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
            [tenantId, limit, offset],
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
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};