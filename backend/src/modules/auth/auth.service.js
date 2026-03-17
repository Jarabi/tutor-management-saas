import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../config/db.js";

export const registerUser = async (data) => {
    const { name, email, password, tenantName } = data;
    
    if (!name || !email || !password || !tenantName) {
        throw new Error('MISSING_REQUIRED_FIELDS');
    }

    const client = await pool.connect();

    try {
        // Start transaction
        await client.query("BEGIN");

        // Check if email exists
        const existingUser = await client.query(
            'SELECT id FROM users WHERE email = $1',
            [email],
        );

        if (existingUser.rows.length > 0) {
            throw new Error("USER_EXISTS");
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
        await client.query("COMMIT");

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, tenantId },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return {
            message: "Account created",
            token,
            user
        };
    } catch (error) {
        // Undo everything if anything fails
        await client.query("ROLLBACK");
        throw error;
    } finally {
        // Release connection back to pool
        client.release();
    }
};