import express from 'express';
import { PatientsController } from './patients.controller';
import { AuthMiddleware } from '@api/auth/auth.middleware';

const router = express.Router();

router.post('/create', AuthMiddleware.verifyToken, PatientsController.createPatients);

router.get('/patients', AuthMiddleware.verifyToken, PatientsController.getAllPatients);

router.get('/patients/:id', AuthMiddleware.verifyToken, PatientsController.getPatients);

router.patch('/patients', AuthMiddleware.verifyToken, PatientsController.updatePatients);

router.patch('/update-history', AuthMiddleware.verifyToken, PatientsController.updateHistory);

router.delete('patients/:id', AuthMiddleware.verifyToken, PatientsController.deletePatients);

export default router;
