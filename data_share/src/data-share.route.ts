import express, {Request, Response} from 'express';
import { DataShareController } from './data-share.controller';
import { AuthMiddleware } from './auth/auth.middleware';
import { Web3Service } from './web3';

const router = express.Router();

router.post('/share-data', AuthMiddleware.loginByToken, DataShareController.shareData);

router.post('/receive-data', AuthMiddleware.loginByToken, DataShareController.receiveData);

router.post("/set-address-constract", AuthMiddleware.loginByToken, (req: Request, res: Response) => {
    const {address } = req.body;
    
    if(address){
        Web3Service.constractAddress = address;
        res.json({message: "Success", address: Web3Service.constractAddress});
        res.status(200);
        res.end();
        return;
    }
    res.json({message: "ERROR"});
    res.status(404);
    res.end();
    return;
})

export default router;
