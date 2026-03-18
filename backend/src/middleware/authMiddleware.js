import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    if (!process.env.JWT_SECRET) {
        return res
            .status(500)
            .json({
                message: 'Server misconfiguration: JWT_SECRET is missing',
            });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.tenantId) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }

        req.user = decoded;
        req.tenantId = decoded.tenantId;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
