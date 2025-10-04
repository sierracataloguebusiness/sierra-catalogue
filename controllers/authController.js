import {login, signup} from "../services/authServices.js";

export const handleSignup = async (req, res) => {
    try {
        const data = await signup(req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const handleLogin = async (req, res) => {
    try {
        const data = await login(req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
}

