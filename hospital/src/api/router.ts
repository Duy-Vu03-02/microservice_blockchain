import express from 'express';
import hospitalRouter from './hospital/hospital.route';

const router = express.Router();

router.use('/hospital-service', hospitalRouter);

export default router;
