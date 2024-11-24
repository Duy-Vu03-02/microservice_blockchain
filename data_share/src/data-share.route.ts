import express from 'express';
import { DataShareController } from './data-share.controller';
import { AuthMiddleware } from './auth/auth.middleware';

const router = express.Router();

router.post('/share-data', AuthMiddleware.loginByToken, DataShareController.shareData);

router.post('/receive-data', AuthMiddleware.loginByToken, DataShareController.receiveData);

export default router;