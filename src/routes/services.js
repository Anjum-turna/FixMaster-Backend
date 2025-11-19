import express from 'express';
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Services routes – OK' }));
export default router;
