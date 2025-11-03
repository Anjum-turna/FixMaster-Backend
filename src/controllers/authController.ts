import { Request, Response } from 'express';
import { registerService, loginService } from '../services/authService';

export const registerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, phone, address, password } = req.body;
    const { token, user } = await registerService({ email, username, phone, address, password });
    res.status(201).json({ success: true, token, user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginService({ email, password });
    res.status(200).json({ success: true, token, user });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};