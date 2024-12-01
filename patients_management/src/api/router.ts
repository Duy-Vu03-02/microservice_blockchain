import express from 'express';
import patientsRouter from './patients/patients.route';

const router = express.Router();

router.use('/patients-service', patientsRouter);

export default router;
