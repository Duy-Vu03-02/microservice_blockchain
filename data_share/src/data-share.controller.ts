import express, { Request, Response, NextFunction } from 'express';
import { HospitalModel } from './hospital';
import crypto from 'crypto';
import { Web3Service } from './web3';

export class DataShareController {
    public static shareData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (req.user) {
                const { patient_data } = req.body;

                if (patient_data && patient_data.cccd && req.user.hospital_id) {
                    const hospital = (await HospitalModel.findById(req.user.hospital_id)).transform();
                    if (hospital) {
                        const publicKey = hospital.publicKey;
                        const base64_data = JSON.stringify(patient_data);
                        const encode = DataShareController.encryptData(publicKey, base64_data);

                        const accounts = await Web3Service.getAccounts();
                        const account = accounts[0];
                        const transaction = Web3Service.getConstract().methods.shareData(
                            patient_data.cccd,
                            Buffer.from(encode),
                        );

                        const gas = await transaction.estimateGas({ from: account });

                        const gasPrice = await Web3Service.getWeb3().eth.getGasPrice();

                        const data = await transaction.send({
                            from: account,
                            gas: gas,
                            gasPrice: gasPrice,
                        });

                        res.json({
                            message: 'Chia se len blockchain thanh cong',
                            data: {
                                transactionHash: data.transactionHash,
                                blockHash: data.blockHash,
                                from: data.from,
                                to: data.to,
                            },
                        });
                        res.status(200);
                        res.end();
                        return;
                    }
                }
            }

            throw new Error('Khong the chia se data');
        } catch (err) {
            console.error(err);
            res.json({
                message: 'That bai khoong the send data',
            });
            res.status(404);
            res.end();
        }
    };

    public static encryptData(publicKey, data) {
        try {
            const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(data));
            return encryptedData.toString('base64');
        } catch (err) {
            console.log(err);
        }
    }

    public static decryptData(privateKey, encryptedData) {
        const bufferEncryptedData = Buffer.from(encryptedData, 'base64');
        const decrypted = crypto.privateDecrypt(privateKey, bufferEncryptedData);
        return decrypted.toString();
    }

    public static receiveData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {};
}
