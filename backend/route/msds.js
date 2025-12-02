// routes/msdsRoutes.js
import express from 'express';
import { handleMsdsRequest } from '../controller/msdsInquiry.js';

const router = express.Router();

// POST /api/msds-req
router.post('/add', handleMsdsRequest);

export default router;