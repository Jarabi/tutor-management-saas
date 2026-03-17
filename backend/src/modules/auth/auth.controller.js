import * as authService from "./auth.service.js";

export const register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        if (error.message === "USER_EXISTS") {
            return res.status(409).json({ message: "User already exists." });
        }

        console.error(error);
        res.status(500).json({ message: "Registration failed." });
    }
}