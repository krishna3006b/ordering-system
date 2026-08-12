import { Router, Request, Response } from 'express';
import { UserType } from '../types';

const router = Router();

router.post('/api/user/profile', (req: Request, res: Response) => {
    const { user } = req.body;
    const email = user?.email || null;
    const phoneNumber = user?.phoneNumber || null;

    if (!email && !phoneNumber) {
        return res.status(400).send({ message: 'Email or phone number is required' });
    }

    // Continue with the rest of the endpoint logic
    res.send({ message: 'Profile updated successfully' });
});

export default router;