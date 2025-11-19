import express from 'express';
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Admin routes – OK' }));
export default router;
