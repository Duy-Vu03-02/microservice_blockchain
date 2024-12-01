import express from 'express';
import { HospitalController } from './hospital.controller';
import { AuthMiddleware } from '@api/auth/auth.middleware';

const router = express.Router();

router.post('/create', AuthMiddleware.verifyToken, HospitalController.createHospital);

router.get('/hospitals', AuthMiddleware.verifyToken, HospitalController.getAllHospital);

router.get('/hospital/:id', AuthMiddleware.verifyToken, HospitalController.getHospital);

router.patch('/hospital', AuthMiddleware.verifyToken, HospitalController.updateHospital);

router.delete('hospital/:id', AuthMiddleware.verifyToken, HospitalController.deleteHospital);

export default router;
