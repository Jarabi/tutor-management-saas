import * as authService from './auth.service.js';

export const register = async (req, res) => {
    const { name, email, password, tenantName } = req.body;

    const data = {
        name: name?.trim(),
        email: email?.trim(),
        password,
        tenantName: tenantName?.trim(),
    };

    if (!data.name || !data.email || !data.password || !data.tenantName) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const user = await authService.registerUser(data);
        res.status(201).json(user);
    } catch (error) {
        if (error.message === 'USER_EXISTS') {
            return res.status(409).json({ message: 'User already exists.' });
        }

        console.error(error);
        res.status(500).json({ message: 'Registration failed.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const data = {
        email: email?.trim(),
        password,
    };

    if (!data.email || !data.password) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const result = await authService.loginUser(data);
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }

        if (error.message === 'JWT_SECRET_NOT_CONFIGURED') {
            return res
                .status(500)
                .json({
                    message: 'Server misconfiguration: JWT_SECRET is missing',
                });
        }
        console.error(error);
        res.status(500).json({ message: 'Login failed.' });
    }
};
