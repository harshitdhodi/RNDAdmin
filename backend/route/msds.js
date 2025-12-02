// routes/msdsRoutes.js
import express from 'express';
import { handleMsdsRequest } from '../controller/msdsInquiry';

const router = express.Router();

// POST /api/msds-req
router.post('/add', handleMsdsRequest);

export default router;