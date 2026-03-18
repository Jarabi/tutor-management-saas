import pool from '../../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (data) => {
    const { name, email, password, tenantName } = data;

    const client = await pool.connect();

    try {
        // Start transaction
        await client.query('BEGIN');

        // Check if email exists
        const existingUser = await client.query(
            'SELECT id FROM users WHERE email = $1',
            [email],
        );

        if (existingUser.rows.length > 0) {
            throw new Error('USER_EXISTS');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create tenant
        const tenantResult = await client.query(
            'INSERT INTO tenants (name) VALUES ($1) RETURNING id',
            [tenantName],
        );

        const tenantId = tenantResult.rows[0].id;

        // Create user
        const userResult = await client.query(
            `INSERT INTO users
            (tenant_id, name, email, password_hash)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email`,
            [tenantId, name, email, hashedPassword],
        );

        const user = userResult.rows[0];

        // Commit transaction
        await client.query('COMMIT');

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, tenantId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        );

        return {
            message: 'Account created',
            token,
            user,
        };
    } catch (error) {
        // Undo everything if anything fails
        await client.query('ROLLBACK');
        throw error;
    } finally {
        // Release connection back to pool
        client.release();
    }
};

export const loginUser = async ({ email, password }) => {
    const result = await pool.query(
        `SELECT id, tenant_id, name, email, password_hash
        FROM users
        WHERE email = $1`,
        [email],
    );

    if (result.rows.length === 0) {
        throw new Error('INVALID_CREDENTIALS_USER');
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
        throw new Error('INVALID_CREDENTIALS');
    }

    const token = jwt.sign(
        {
            userId: user.id,
            tenantId: user.tenant_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
    );

    return {
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
};
