import * as authService from './auth.service.js';

export const register = async (req, res) => {
    const { name, email, password, tenantName } = req.body;

    if (!name || !email || !password || !tenantName) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    const data = {
        name: name.trim(),
        email: email.trim(),
        password,
        tenantName: tenantName.trim(),
    };

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

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    const data = {
        email: email.trim(),
        password,
    };

    try {
        const result = await authService.loginUser(data);
        res.status(201).json(result);
    } catch (error) {
        if (error.message === 'INVALID_CREDENTIALS_USER') {
            return res.status(401).json({ message: 'User does not exist' });
        }

        if (error.message === 'INVALID_CREDENTIALS') {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }
        console.error(error);
        res.status(500).json({ message: 'Login failed.' });
    }
};
